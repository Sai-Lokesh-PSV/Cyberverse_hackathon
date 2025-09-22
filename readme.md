# Cyberverse Land Registry System

A comprehensive blockchain-powered land registry system with AI fraud detection, built with FastAPI, PostgreSQL, and React.

## 🏗️ Architecture

### Backend (FastAPI + PostgreSQL)
- **Database**: PostgreSQL with comprehensive schema
- **ORM**: SQLAlchemy 2.0 with relationship mapping
- **API**: RESTful endpoints with Pydantic validation
- **Features**: AI analysis, fraud detection, blockchain integration

### Frontend (React + Vite)
- **Framework**: React 18 with TypeScript
- **UI**: shadcn/ui components with Tailwind CSS
- **State**: React Query for API management
- **Features**: Real-time data, responsive design

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- PostgreSQL 12+
- Git

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb cyberverse

# Optional: Run initialization script
psql -d cyberverse -f data/init_database.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install fastapi uvicorn "SQLAlchemy>=2" "psycopg[binary]" python-dotenv

# Create environment file
echo "DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/cyberverse" > .env
echo "FRONTEND_ORIGIN=http://localhost:8080" >> .env

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Optional: Configure API base
echo "VITE_API_BASE=http://localhost:8000" > .env

# Start development server
npm run dev
```

## 📊 Database Schema

### Core Entities

#### Users
- **Roles**: Admin, User, Verifier
- **Fields**: ID, email, name, phone, ID number, role, status

#### Parcels
- **Properties**: Address, coordinates, area, zoning, status
- **Relationships**: Owner, transfers, documents, AI analysis
- **Status**: Verified, Pending, Disputed, Rejected

#### Transfers
- **Details**: Amount, status, dates, blockchain hash
- **Participants**: From user, to user, parcel
- **Status**: Pending, Approved, Rejected, Completed, Cancelled

#### AI Analysis
- **Metrics**: Fraud risk, market value, confidence score
- **Data**: Price history, analysis metadata
- **Risk Levels**: Low, Medium, High, Critical

#### Documents
- **Types**: Title deeds, surveys, tax assessments, identity docs
- **Features**: File hashing, verification status
- **Attachments**: Parcels, transfers

#### Additional Entities
- **Transactions**: Blockchain transaction history
- **Encumbrances**: Mortgages, liens, easements
- **Fraud Alerts**: Risk detection and investigation
- **System Stats**: Dashboard metrics

## 🔌 API Endpoints

### Parcels
- `GET /parcels` - List parcels with search/filter
- `GET /parcel/{id}` - Detailed parcel information

### Transfers
- `GET /transfers` - List transfers with status filter
- `GET /transfers/{id}` - Specific transfer details

### Dashboard
- `GET /dashboard/stats` - System statistics
- `GET /fraud-alerts` - Fraud detection alerts

### Users
- `GET /users` - List users
- `GET /users/{id}` - User details

## 🎯 Features

### For Property Owners
- **Property Search**: Find properties by address, owner, or ID
- **Transfer Requests**: Initiate ownership transfers
- **Document Management**: Upload and verify documents
- **Transaction History**: View blockchain transaction records

### For Administrators
- **Dashboard**: System-wide statistics and metrics
- **Transfer Approval**: Review and approve transfer requests
- **Fraud Detection**: Monitor and investigate fraud alerts
- **User Management**: Manage user accounts and permissions

### For Verifiers
- **Document Verification**: Review and verify property documents
- **Fraud Investigation**: Investigate suspicious activities
- **Quality Assurance**: Ensure data accuracy and integrity

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
DATABASE_URL=postgresql+psycopg://user:password@host:port/database
FRONTEND_ORIGIN=http://localhost:8080
```

#### Frontend (.env)
```bash
VITE_API_BASE=http://localhost:8000
```

### Database Configuration
- **Connection Pool**: Configured for production use
- **Indexes**: Optimized for search and performance
- **Constraints**: Data integrity and referential integrity
- **Extensions**: UUID generation, text search, spatial data

## 🚀 Deployment

### Production Setup
1. **Database**: Configure PostgreSQL with proper security
2. **Backend**: Use production WSGI server (Gunicorn)
3. **Frontend**: Build and serve static files
4. **Environment**: Set production environment variables
5. **Security**: Configure CORS, authentication, and HTTPS

### Docker Support
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📈 Performance

### Database Optimization
- **Indexes**: Strategic indexing for common queries
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Optimized SQL queries with relationships

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Caching**: React Query for API response caching
- **Bundle Size**: Optimized build with tree shaking

## 🔒 Security

### Data Protection
- **Input Validation**: Pydantic schemas for data validation
- **SQL Injection**: SQLAlchemy ORM protection
- **CORS**: Configured for specific origins
- **File Upload**: Secure document handling

### Blockchain Integration
- **Hash Verification**: Document and transaction hashing
- **Immutable Records**: Blockchain transaction logging
- **Audit Trail**: Complete transaction history

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📚 Documentation

### API Documentation
- **Swagger UI**: Available at `http://localhost:8000/docs`
- **ReDoc**: Available at `http://localhost:8000/redoc`

### Database Documentation
- **Schema**: Comprehensive entity relationship diagram
- **Migrations**: Database version control
- **Seeding**: Demo data for development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

Version 1
Idea List:
