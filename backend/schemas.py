from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from models import UserRole, ParcelStatus, TransferStatus, DocumentType, FraudRiskLevel

# User Schemas
class UserBase(BaseModel):
    email: str
    name: str
    phone: Optional[str] = None
    id_number: Optional[str] = None
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Parcel Schemas
class ParcelBase(BaseModel):
    address: str
    coordinates_lat: float
    coordinates_lng: float
    area_sqft: float
    area_display: Optional[str] = None
    zoning: Optional[str] = None
    status: ParcelStatus = ParcelStatus.PENDING

class ParcelCreate(ParcelBase):
    owner_id: str
    blockchain_hash: Optional[str] = None

class ParcelResponse(ParcelBase):
    id: str
    owner_id: str
    blockchain_hash: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ParcelDetailResponse(ParcelResponse):
    owner: UserResponse
    ai_analysis: Optional['AIAnalysisResponse'] = None
    documents: List['DocumentResponse'] = []
    transactions: List['TransactionResponse'] = []
    encumbrances: List['EncumbranceResponse'] = []

# Transfer Schemas
class TransferBase(BaseModel):
    amount: float
    status: TransferStatus = TransferStatus.PENDING
    transfer_date: Optional[datetime] = None
    notes: Optional[str] = None

class TransferCreate(TransferBase):
    parcel_id: str
    to_user_id: str

class TransferResponse(TransferBase):
    id: str
    parcel_id: str
    from_user_id: str
    to_user_id: str
    blockchain_hash: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TransferDetailResponse(TransferResponse):
    parcel: ParcelResponse
    from_user: UserResponse
    to_user: UserResponse
    documents: List['DocumentResponse'] = []

# Document Schemas
class DocumentBase(BaseModel):
    name: str
    type: DocumentType
    file_size: Optional[int] = None
    file_hash: Optional[str] = None

class DocumentCreate(DocumentBase):
    parcel_id: Optional[str] = None
    transfer_id: Optional[str] = None

class DocumentResponse(DocumentBase):
    id: str
    file_path: Optional[str] = None
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionBase(BaseModel):
    type: str
    from_entity: Optional[str] = None
    to_entity: Optional[str] = None

class TransactionCreate(TransactionBase):
    parcel_id: str
    blockchain_hash: Optional[str] = None

class TransactionResponse(TransactionBase):
    id: str
    parcel_id: str
    blockchain_hash: Optional[str] = None
    transaction_date: datetime

    class Config:
        from_attributes = True

# AI Analysis Schemas
class AIAnalysisBase(BaseModel):
    fraud_risk: FraudRiskLevel
    risk_score: float
    market_value: float
    confidence: float
    price_history: Optional[List[Dict[str, Any]]] = None
    analysis_metadata: Optional[Dict[str, Any]] = None

class AIAnalysisCreate(AIAnalysisBase):
    parcel_id: str

class AIAnalysisResponse(AIAnalysisBase):
    id: str
    parcel_id: str
    last_valuation: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Encumbrance Schemas
class EncumbranceBase(BaseModel):
    type: str
    description: Optional[str] = None
    amount: Optional[float] = None
    is_active: bool = True

class EncumbranceCreate(EncumbranceBase):
    parcel_id: str

class EncumbranceResponse(EncumbranceBase):
    id: str
    parcel_id: str
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Fraud Alert Schemas
class FraudAlertBase(BaseModel):
    risk_level: FraudRiskLevel
    reason: str
    is_resolved: bool = False
    resolution_notes: Optional[str] = None

class FraudAlertCreate(FraudAlertBase):
    parcel_id: str
    reported_by: Optional[str] = None

class FraudAlertResponse(FraudAlertBase):
    id: str
    parcel_id: str
    reported_by: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# System Stats Schemas
class SystemStatsBase(BaseModel):
    stat_name: str
    stat_value: float
    stat_metadata: Optional[Dict[str, Any]] = None

class SystemStatsResponse(SystemStatsBase):
    id: str
    updated_at: datetime

    class Config:
        from_attributes = True

# Dashboard/Admin Schemas
class DashboardStats(BaseModel):
    total_properties: int
    pending_transfers: int
    fraud_alerts: int
    active_users: int
    monthly_transfers: int
    total_transfer_value: float

class ParcelSearchResponse(BaseModel):
    id: str
    address: str
    owner_name: str
    area_display: str
    status: str
    blockchain_hash: Optional[str]
    last_updated: str
    fraud_risk: str
    estimated_value: str

# Update forward references
ParcelDetailResponse.model_rebuild()
TransferDetailResponse.model_rebuild()
