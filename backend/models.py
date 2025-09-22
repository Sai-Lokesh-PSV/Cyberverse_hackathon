from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    VERIFIER = "verifier"

class ParcelStatus(str, enum.Enum):
    VERIFIED = "verified"
    PENDING = "pending"
    DISPUTED = "disputed"
    REJECTED = "rejected"

class TransferStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class DocumentType(str, enum.Enum):
    TITLE_DEED = "title_deed"
    SURVEY_REPORT = "survey_report"
    TAX_ASSESSMENT = "tax_assessment"
    TRANSFER_DEED = "transfer_deed"
    IDENTITY_DOCUMENT = "identity_document"
    OTHER = "other"

class FraudRiskLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(64), primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50))
    id_number = Column(String(100), unique=True, index=True)
    role = Column(SQLEnum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    owned_parcels = relationship("Parcel", back_populates="owner")
    transfer_requests = relationship("Transfer", foreign_keys="Transfer.from_user_id", back_populates="from_user")
    received_transfers = relationship("Transfer", foreign_keys="Transfer.to_user_id", back_populates="to_user")

class Parcel(Base):
    __tablename__ = "parcels"
    
    id = Column(String(64), primary_key=True)
    address = Column(Text, nullable=False)
    coordinates_lat = Column(Float, nullable=False)
    coordinates_lng = Column(Float, nullable=False)
    area_sqft = Column(Float, nullable=False)
    area_display = Column(String(100))  # e.g., "0.25 acres"
    zoning = Column(String(100))
    status = Column(SQLEnum(ParcelStatus), default=ParcelStatus.PENDING)
    blockchain_hash = Column(String(128), unique=True, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Foreign Keys
    owner_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="owned_parcels")
    transfers = relationship("Transfer", back_populates="parcel")
    documents = relationship("Document", back_populates="parcel")
    transactions = relationship("Transaction", back_populates="parcel")
    ai_analysis = relationship("AIAnalysis", back_populates="parcel", uselist=False)
    encumbrances = relationship("Encumbrance", back_populates="parcel")

class Transfer(Base):
    __tablename__ = "transfers"
    
    id = Column(String(64), primary_key=True)
    amount = Column(Float, nullable=False)
    status = Column(SQLEnum(TransferStatus), default=TransferStatus.PENDING)
    transfer_date = Column(DateTime)
    notes = Column(Text)
    blockchain_hash = Column(String(128), unique=True, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Foreign Keys
    parcel_id = Column(String(64), ForeignKey("parcels.id"), nullable=False)
    from_user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    to_user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    
    # Relationships
    parcel = relationship("Parcel", back_populates="transfers")
    from_user = relationship("User", foreign_keys=[from_user_id], back_populates="transfer_requests")
    to_user = relationship("User", foreign_keys=[to_user_id], back_populates="received_transfers")
    documents = relationship("Document", back_populates="transfer")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String(64), primary_key=True)
    name = Column(String(255), nullable=False)
    type = Column(SQLEnum(DocumentType), nullable=False)
    file_path = Column(String(500))
    file_size = Column(Integer)  # in bytes
    file_hash = Column(String(128), unique=True, index=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    
    # Foreign Keys
    parcel_id = Column(String(64), ForeignKey("parcels.id"))
    transfer_id = Column(String(64), ForeignKey("transfers.id"))
    
    # Relationships
    parcel = relationship("Parcel", back_populates="documents")
    transfer = relationship("Transfer", back_populates="documents")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(String(64), primary_key=True)
    type = Column(String(100), nullable=False)  # "ownership_transfer", "verification_update", etc.
    from_entity = Column(String(255))
    to_entity = Column(String(255))
    blockchain_hash = Column(String(128), unique=True, index=True)
    transaction_date = Column(DateTime, default=func.now())
    
    # Foreign Keys
    parcel_id = Column(String(64), ForeignKey("parcels.id"), nullable=False)
    
    # Relationships
    parcel = relationship("Parcel", back_populates="transactions")

class AIAnalysis(Base):
    __tablename__ = "ai_analysis"
    
    id = Column(String(64), primary_key=True)
    fraud_risk = Column(SQLEnum(FraudRiskLevel), nullable=False)
    risk_score = Column(Float, nullable=False)  # 0.0 to 1.0
    market_value = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)  # 0.0 to 1.0
    last_valuation = Column(DateTime, default=func.now())
    price_history = Column(JSON)  # Array of {date, value} objects
    analysis_metadata = Column(JSON)  # Additional AI analysis data
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Foreign Keys
    parcel_id = Column(String(64), ForeignKey("parcels.id"), nullable=False, unique=True)
    
    # Relationships
    parcel = relationship("Parcel", back_populates="ai_analysis")

class Encumbrance(Base):
    __tablename__ = "encumbrances"
    
    id = Column(String(64), primary_key=True)
    type = Column(String(100), nullable=False)  # "mortgage", "lien", "easement", etc.
    description = Column(Text)
    amount = Column(Float)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    resolved_at = Column(DateTime)
    
    # Foreign Keys
    parcel_id = Column(String(64), ForeignKey("parcels.id"), nullable=False)
    
    # Relationships
    parcel = relationship("Parcel", back_populates="encumbrances")

class FraudAlert(Base):
    __tablename__ = "fraud_alerts"
    
    id = Column(String(64), primary_key=True)
    risk_level = Column(SQLEnum(FraudRiskLevel), nullable=False)
    reason = Column(Text, nullable=False)
    is_resolved = Column(Boolean, default=False)
    resolution_notes = Column(Text)
    created_at = Column(DateTime, default=func.now())
    resolved_at = Column(DateTime)
    
    # Foreign Keys
    parcel_id = Column(String(64), ForeignKey("parcels.id"), nullable=False)
    reported_by = Column(String(64), ForeignKey("users.id"))
    
    # Relationships
    parcel = relationship("Parcel")
    reporter = relationship("User")

class SystemStats(Base):
    __tablename__ = "system_stats"
    
    id = Column(String(64), primary_key=True)
    stat_name = Column(String(100), unique=True, nullable=False)
    stat_value = Column(Float, nullable=False)
    stat_metadata = Column(JSON)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
