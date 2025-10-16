# agent_db.py

import json
from sqlalchemy import Column, String, Enum, PrimaryKeyConstraint, select, delete, update
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import enum

# --- SQLAlchemy Setup ---
Base = declarative_base()

class AgentType(str, enum.Enum):
    a2a_agent = "a2a_agent"
    orchestrator = "orchestrator"
    local_agent = "local_agent"

class Agent(Base):
    __tablename__ = "agents"

    name = Column(String, nullable=False)
    url = Column(String, nullable=True)
    type = Column(Enum(AgentType), nullable=False)
    description = Column(String, nullable=True)
    instructions = Column(String, nullable=True)
    framework = Column(String, nullable=True)
    subAgents = Column(String, nullable=True)

    __table_args__ = (
        PrimaryKeyConstraint('name', 'url', name='agent_pk'),
    )

# --- Database Configuration ---
DATABASE_URL = "sqlite+aiosqlite:///agents.db"
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# --- Dependency for FastAPI ---
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# --- DB Initialization ---
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# --- DB Operations ---
async def insert_agent(data: dict, db: AsyncSession):
    stmt = select(Agent).where(Agent.name == data["name"], Agent.url == data["url"])
    result = await db.execute(stmt)
    existing_agent = result.scalar_one_or_none()

    if existing_agent:
        return {"success": True, "message": "Agent already exists", "agentData": data}

    new_agent = Agent(
        name=data["name"],
        url=data["url"],
        type=data["type"],
        description=data.get("description", ""),
        instructions=data.get("instructions", ""),
        subAgents=json.dumps(data.get("subAgents", [])),
        framework=data.get("framework", "")
    )
    db.add(new_agent)
    await db.commit()

    return {"success": True, "agentData": data}

async def fetch_all_agents(db: AsyncSession):
    stmt = select(Agent)
    result = await db.execute(stmt)
    agents = result.scalars().all()

    return [
        {
            "name": agent.name,
            "url": agent.url,
            "type": agent.type,
            "description": agent.description,
            "instructions": agent.instructions,
            "framework": agent.framework,
            "subAgents": json.loads(agent.subAgents) if agent.subAgents else []
        }
        for agent in agents
    ]

async def fetch_orchestrator_by_name(name: str) -> dict:
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Agent).where(Agent.name == name, Agent.type == AgentType.orchestrator)
        )
        agent = result.scalar_one_or_none()
        if not agent:
            raise ValueError(f"Orchestrator '{name}' not found in database.")

        return {
            "name": agent.name,
            "url": agent.url,
            "type": agent.type,
            "description": agent.description,
            "instructions": agent.instructions,
            "subAgents": json.loads(agent.subAgents) if agent.subAgents else []
        }
    
async def fetch_local_agent_by_name(name: str) -> dict:
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Agent).where(Agent.name == name, Agent.type == AgentType.local_agent)
        )
        agent = result.scalar_one_or_none()
        if not agent:
            raise ValueError(f"Orchestrator '{name}' not found in database.")

        return {
            "name": agent.name,
            "url": agent.url,
            "type": agent.type,
            "description": agent.description,
            "instructions": agent.instructions,
            "subAgents": json.loads(agent.subAgents) if agent.subAgents else []
        }

async def delete_agent(data: dict, db: AsyncSession):
    name = data.get("name")
    url = data.get("url")
    agent_type = data.get("type")

    if not name or not agent_type:
        return {"success": False, "error": "Missing required fields"}

    stmt = delete(Agent).where(Agent.name == name, Agent.type == agent_type)

    # For non-local agents, also match URL
    if agent_type != AgentType.local_agent:
        if not url:
            return {"success": False, "error": "Missing URL for non-local agent"}
        stmt = stmt.where(Agent.url == url)

    result = await db.execute(stmt)
    await db.commit()

    if result.rowcount > 0:
        return {"success": True}
    else:
        return {"success": False, "error": "Agent not found"}


# Edit agent data
async def update_agent(data: dict, db: AsyncSession):
    name = data.get("name")
    agent_type = data.get("type")
    if not name or not agent_type:
        return {"success": False, "error": "Missing required fields"}

    stmt = update(Agent).where(Agent.name == name, Agent.type == agent_type)

    stmt = stmt.values(
        instructions=data.get("instructions", ""),
        subAgents=json.dumps(data.get("subAgents", []))
    )

    result = await db.execute(stmt)
    await db.commit()

    if result.rowcount > 0:
        return {"success": True, "message": "Agent updated", "agentData": data}
    else:
        return {"success": False, "error": "Agent not found"}