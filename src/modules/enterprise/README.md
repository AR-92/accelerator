# Enterprise Module

Handles enterprise business management including CRUD operations, search, filtering, statistics, and bulk operations.

## API Endpoints

- `GET /api/enterprises` - Get all enterprises
- `GET /api/enterprises/search` - Search enterprises
- `GET /api/enterprises/:id` - Get enterprise by ID
- `POST /api/enterprises` - Create enterprise
- `PUT /api/enterprises/:id` - Update enterprise
- `DELETE /api/enterprises/:id` - Delete enterprise
- Bulk operations and statistics available

## Structure

- controllers/EnterpriseController.js
- services/EnterpriseService.js
- repositories/EnterpriseRepository.js
- models/Enterprise.js
- routes/api/ and routes/pages/
