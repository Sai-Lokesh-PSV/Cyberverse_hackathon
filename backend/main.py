from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
from sqlalchemy import create_engine, func, desc
from sqlalchemy.orm import sessionmaker, Session
from models import Base, User, Parcel, Transfer, Document, Transaction, AIAnalysis, Encumbrance, FraudAlert, SystemStats
from schemas import (
    UserResponse, ParcelResponse, ParcelDetailResponse, ParcelSearchResponse,
    TransferResponse, TransferDetailResponse, DocumentResponse, TransactionResponse,
    AIAnalysisResponse, EncumbranceResponse, FraudAlertResponse, DashboardStats
)

# Database configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5432/cyberverse",
)

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


app = FastAPI()

# Allow frontend localhost access (Vite dev server on 8080)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:8080")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.on_event("startup")
def on_startup() -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)
    # Seed demo data if tables are empty
    with SessionLocal() as db:
        if db.query(Parcel).count() == 0:
            seed_demo_data(db)

def seed_demo_data(db: Session):
    """Seed the database with comprehensive demo data"""
    from models import UserRole, ParcelStatus, TransferStatus, DocumentType, FraudRiskLevel
    from datetime import datetime
    
    # Create demo users
    users = [
        User(
            id="user-001",
            email="john.smith@email.com",
            name="John Smith",
            phone="+1-555-0101",
            id_number="SSN-XXX-XX-1234",
            role=UserRole.USER
        ),
        User(
            id="user-002", 
            email="sarah.johnson@email.com",
            name="Sarah Johnson",
            phone="+1-555-0102",
            id_number="SSN-XXX-XX-5678",
            role=UserRole.USER
        ),
        User(
            id="user-003",
            email="mike.wilson@email.com", 
            name="Mike Wilson",
            phone="+1-555-0103",
            id_number="SSN-XXX-XX-9012",
            role=UserRole.USER
        ),
        User(
            id="admin-001",
            email="admin@cyberverse.com",
            name="System Administrator",
            role=UserRole.ADMIN
        )
    ]
    
    for user in users:
        db.add(user)
    
    # Create demo parcels
    parcels = [
        Parcel(
            id="PLT-2024-001",
            address="123 Oak Street, Springfield, County, State 12345",
            coordinates_lat=40.7128,
            coordinates_lng=-74.0060,
            area_sqft=10890,
            area_display="0.25 acres",
            zoning="Residential R-1",
            status=ParcelStatus.VERIFIED,
            blockchain_hash="0x1a2b3c4d5e6f7890abcdef123456789012345678",
            owner_id="user-001"
        ),
        Parcel(
            id="PLT-2024-002",
            address="456 Pine Avenue, Springfield, County, State 12345",
            coordinates_lat=40.7580,
            coordinates_lng=-73.9855,
            area_sqft=7840,
            area_display="0.18 acres",
            zoning="Residential R-1",
            status=ParcelStatus.PENDING,
            blockchain_hash="0x9876543210fedcba0987654321",
            owner_id="user-002"
        ),
        Parcel(
            id="PLT-2024-003",
            address="789 Maple Drive, Springfield, County, State 12345",
            coordinates_lat=40.7505,
            coordinates_lng=-73.9934,
            area_sqft=14375,
            area_display="0.33 acres",
            zoning="Residential R-1",
            status=ParcelStatus.DISPUTED,
            blockchain_hash="0xabcdef123456789012345678",
            owner_id="user-003"
        )
    ]
    
    for parcel in parcels:
        db.add(parcel)
    
    # Create AI analysis for parcels
    ai_analyses = [
        AIAnalysis(
            id="ai-001",
            parcel_id="PLT-2024-001",
            fraud_risk=FraudRiskLevel.LOW,
            risk_score=0.15,
            market_value=485000.0,
            confidence=0.92,
            price_history=[
                {"date": "2024-01", "value": 485000},
                {"date": "2023-07", "value": 472000},
                {"date": "2023-01", "value": 445000}
            ]
        ),
        AIAnalysis(
            id="ai-002",
            parcel_id="PLT-2024-002",
            fraud_risk=FraudRiskLevel.LOW,
            risk_score=0.20,
            market_value=392000.0,
            confidence=0.88
        ),
        AIAnalysis(
            id="ai-003",
            parcel_id="PLT-2024-003",
            fraud_risk=FraudRiskLevel.MEDIUM,
            risk_score=0.45,
            market_value=527000.0,
            confidence=0.75
        )
    ]
    
    for analysis in ai_analyses:
        db.add(analysis)
    
    # Create demo transfers
    transfers = [
        Transfer(
            id="TXN-2024-001",
            parcel_id="PLT-2024-001",
            from_user_id="user-001",
            to_user_id="user-002",
            amount=485000.0,
            status=TransferStatus.COMPLETED,
            transfer_date=datetime(2024, 1, 20),
            blockchain_hash="0x1a2b3c4d5e6f7890abcdef"
        ),
        Transfer(
            id="TXN-2024-002",
            parcel_id="PLT-2024-002",
            from_user_id="user-002",
            to_user_id="user-003",
            amount=392000.0,
            status=TransferStatus.PENDING,
            transfer_date=datetime(2024, 1, 19)
        )
    ]
    
    for transfer in transfers:
        db.add(transfer)
    
    # Create demo documents
    documents = [
        Document(
            id="doc-001",
            name="Title Deed",
            type=DocumentType.TITLE_DEED,
            file_size=2200000,
            file_hash="0xabc123...",
            parcel_id="PLT-2024-001",
            is_verified=True
        ),
        Document(
            id="doc-002",
            name="Survey Report",
            type=DocumentType.SURVEY_REPORT,
            file_size=5300000,
            file_hash="0xdef456...",
            parcel_id="PLT-2024-001",
            is_verified=True
        )
    ]
    
    for doc in documents:
        db.add(doc)
    
    # Create demo transactions
    transactions = [
        Transaction(
            id="txn-001",
            parcel_id="PLT-2024-001",
            type="Verification Update",
            from_entity="System",
            to_entity="Verified Status",
            blockchain_hash="0x1a2b3c4d..."
        ),
        Transaction(
            id="txn-002",
            parcel_id="PLT-2024-001",
            type="Ownership Transfer",
            from_entity="Jane Doe",
            to_entity="John Smith",
            blockchain_hash="0x9876543a..."
        )
    ]
    
    for txn in transactions:
        db.add(txn)
    
    # Create system stats
    stats = [
        SystemStats(id="stat-001", stat_name="total_properties", stat_value=1247.0),
        SystemStats(id="stat-002", stat_name="pending_transfers", stat_value=23.0),
        SystemStats(id="stat-003", stat_name="fraud_alerts", stat_value=4.0),
        SystemStats(id="stat-004", stat_name="active_users", stat_value=89.0),
        SystemStats(id="stat-005", stat_name="monthly_transfers", stat_value=156.0),
        SystemStats(id="stat-006", stat_name="total_transfer_value", stat_value=127400000.0)
    ]
    
    for stat in stats:
        db.add(stat)
    
    db.commit()

# API Endpoints

@app.get("/parcels", response_model=List[ParcelSearchResponse])
def get_parcels(
    search: Optional[str] = Query(None, description="Search by address, owner name, or parcel ID"),
    status: Optional[str] = Query(None, description="Filter by status"),
    db: Session = Depends(get_db)
):
    """Get all parcels with optional search and status filtering"""
    query = db.query(Parcel).join(User, Parcel.owner_id == User.id)
    
    if search:
        query = query.filter(
            (Parcel.address.ilike(f"%{search}%")) |
            (User.name.ilike(f"%{search}%")) |
            (Parcel.id.ilike(f"%{search}%"))
        )
    
    if status:
        query = query.filter(Parcel.status == status)
    
    parcels = query.all()
    
    # Convert to search response format
    result = []
    for parcel in parcels:
        # Get AI analysis for fraud risk and estimated value
        ai_analysis = db.query(AIAnalysis).filter(AIAnalysis.parcel_id == parcel.id).first()
        fraud_risk = ai_analysis.fraud_risk.value if ai_analysis else "low"
        estimated_value = f"${ai_analysis.market_value:,.0f}" if ai_analysis else "$—"
        
        result.append(ParcelSearchResponse(
            id=parcel.id,
            address=parcel.address,
            owner_name=parcel.owner.name,
            area_display=parcel.area_display or f"{parcel.area_sqft:,.0f} sq ft",
            status=parcel.status.value,
            blockchain_hash=parcel.blockchain_hash,
            last_updated=parcel.updated_at.strftime("%Y-%m-%d"),
            fraud_risk=fraud_risk,
            estimated_value=estimated_value
        ))
    
    return result

@app.get("/parcel/{parcel_id}", response_model=ParcelDetailResponse)
def get_parcel(parcel_id: str, db: Session = Depends(get_db)):
    """Get detailed parcel information"""
    parcel = db.query(Parcel).filter(Parcel.id == parcel_id).first()
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    
    return parcel

@app.get("/transfers", response_model=List[TransferDetailResponse])
def get_transfers(
    status: Optional[str] = Query(None, description="Filter by transfer status"),
    db: Session = Depends(get_db)
):
    """Get all transfers with optional status filtering"""
    query = db.query(Transfer)
    
    if status:
        query = query.filter(Transfer.status == status)
    
    transfers = query.order_by(desc(Transfer.created_at)).all()
    return transfers

@app.get("/transfers/{transfer_id}", response_model=TransferDetailResponse)
def get_transfer(transfer_id: str, db: Session = Depends(get_db)):
    """Get specific transfer details"""
    transfer = db.query(Transfer).filter(Transfer.id == transfer_id).first()
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")
    
    return transfer

@app.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    stats = db.query(SystemStats).all()
    stats_dict = {stat.stat_name: stat.stat_value for stat in stats}
    
    return DashboardStats(
        total_properties=int(stats_dict.get("total_properties", 0)),
        pending_transfers=int(stats_dict.get("pending_transfers", 0)),
        fraud_alerts=int(stats_dict.get("fraud_alerts", 0)),
        active_users=int(stats_dict.get("active_users", 0)),
        monthly_transfers=int(stats_dict.get("monthly_transfers", 0)),
        total_transfer_value=stats_dict.get("total_transfer_value", 0.0)
    )

@app.get("/fraud-alerts", response_model=List[FraudAlertResponse])
def get_fraud_alerts(
    resolved: Optional[bool] = Query(None, description="Filter by resolution status"),
    db: Session = Depends(get_db)
):
    """Get fraud alerts"""
    query = db.query(FraudAlert)
    
    if resolved is not None:
        query = query.filter(FraudAlert.is_resolved == resolved)
    
    return query.order_by(desc(FraudAlert.created_at)).all()

@app.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    """Get all users"""
    return db.query(User).all()

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    """Get specific user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user