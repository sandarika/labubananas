# Union Features Documentation

## Overview
The union integration feature allows workers to discover, join, and interact with labor unions that align with their profession and interests. This feature transforms Bunch Up into a comprehensive platform for union organization and worker solidarity.

## Features

### 1. Union Discovery & Browsing
- **Browse All Unions**: View all available unions in a clean, card-based interface
- **Search Functionality**: Search unions by name, description, or tags
- **Industry Filtering**: Filter unions by industry (Healthcare, Technology, Education, etc.)
- **Real-time Member Count**: See how many members each union has

### 2. Union Membership
- **Join Unions**: One-click joining of unions that match your interests
- **Leave Unions**: Ability to leave unions you're no longer interested in
- **Membership Status**: Clear visual indicators showing which unions you've joined
- **My Unions**: Track all unions you're a member of

### 3. Union Information
Each union displays:
- Name and description
- Industry classification
- Member count
- Tags for easy discovery
- Join/Leave button based on membership status

## Database Schema

### Union Model Enhancements
```python
class Union:
    id: Integer (Primary Key)
    name: String (Unique)
    description: Text
    industry: String (NEW)
    tags: String (NEW - comma-separated)
    created_at: DateTime
```

### UnionMember Model (NEW)
```python
class UnionMember:
    id: Integer (Primary Key)
    union_id: Integer (Foreign Key)
    user_id: Integer (Foreign Key)
    joined_at: DateTime
    # Unique constraint on (union_id, user_id)
```

## API Endpoints

### GET /api/unions/
Get list of all unions with optional filtering
- **Query Parameters**:
  - `skip`: Pagination offset (default: 0)
  - `limit`: Number of results (default: 100)
  - `industry`: Filter by industry (optional)
  - `search`: Search query (optional)
- **Returns**: Array of Union objects with `member_count` and `is_member` flags

### GET /api/unions/{union_id}
Get details of a specific union
- **Returns**: Union object with member count and membership status

### GET /api/unions/industries
Get list of all unique industries
- **Returns**: Array of industry strings

### POST /api/unions/{union_id}/join
Join a union (requires authentication)
- **Returns**: Success message
- **Errors**: 400 if already a member, 404 if union not found

### DELETE /api/unions/{union_id}/leave
Leave a union (requires authentication)
- **Returns**: Success message
- **Errors**: 400 if not a member, 404 if union not found

### GET /api/unions/{union_id}/members
Get list of members in a union
- **Query Parameters**: `skip`, `limit`
- **Returns**: Array of user objects (id, username, role)

### POST /api/unions/
Create a new union (requires organizer or admin role)
- **Body**: `{ name, description, industry, tags }`
- **Returns**: Created union object

## Frontend Components

### Unions Page (`/unions`)
Located at: `frontend/app/unions/page.tsx`

Features:
- Responsive grid layout (1/2/3 columns based on screen size)
- Real-time search and filtering
- Loading skeletons for better UX
- Toast notifications for join/leave actions
- Active filters display
- Empty state handling

### UI Components Used
- `Card`: Union display containers
- `Button`: Join/Leave actions
- `Input`: Search functionality
- `Select`: Industry dropdown filter
- `Badge`: Tags and status indicators
- `Skeleton`: Loading states
- Icons from `lucide-react`:
  - `Users`: Member count
  - `Building2`: Industry
  - `Tag`: Tags
  - `CheckCircle2`: Membership status
  - `PlusCircle`: Join action
  - `Search`: Search functionality

## Setup Instructions

### 1. Run Database Migration
```bash
cd backend
python migrate_unions.py
```

### 2. Create Sample Unions (Optional)
```bash
python create_sample_unions.py
```

### 3. Start Backend Server
```bash
uvicorn main:app --reload
```

### 4. Start Frontend
```bash
cd ../frontend
npm run dev
```

### 5. Access Unions Page
Navigate to: `http://localhost:3000/unions`

## Usage Guide

### For Members
1. **Browse Unions**: Navigate to `/unions` from the main navigation
2. **Search**: Use the search bar to find specific unions
3. **Filter**: Select an industry from the dropdown to narrow results
4. **Join**: Click "Join Union" on any union card
5. **View Status**: Joined unions show a "Member" badge
6. **Leave**: Click "Leave Union" if you no longer want membership

### For Organizers/Admins
1. **Create Unions**: Use the POST endpoint or create a UI form
2. **Set Industry**: Categorize your union for better discoverability
3. **Add Tags**: Use comma-separated tags to improve search results
4. **Monitor Membership**: Check member count and member list

## Best Practices

### For Union Organizers
- **Clear Descriptions**: Write comprehensive descriptions of your union's purpose
- **Relevant Tags**: Use specific, searchable tags (e.g., "nurses", "software", "remote")
- **Industry Selection**: Choose the most relevant industry category
- **Active Engagement**: Post regularly to keep members engaged

### For Developers
- **Privacy**: Ensure union membership data is handled securely
- **Performance**: Consider pagination for unions with many members
- **Accessibility**: Maintain ARIA labels and keyboard navigation
- **Error Handling**: Provide clear error messages for failed operations

## Future Enhancements

Potential features to add:
1. **Union Admin Panel**: Allow union organizers to manage their unions
2. **Member Directory**: View and connect with other union members
3. **Union Events**: Integration with the calendar system
4. **Union Polls**: Voting specific to union members
5. **Union Chat**: Private communication channels
6. **Verification System**: Verified unions badge
7. **Recommendation Engine**: Suggest unions based on user profile
8. **Advanced Filtering**: Multiple industries, location-based filtering
9. **Union Analytics**: Member growth, engagement metrics
10. **Federated Unions**: Support for union coalitions

## Security Considerations

- Union membership is tied to authenticated users
- Only authenticated users can join/leave unions
- Creating unions requires organizer or admin role
- Member lists are publicly visible (consider privacy settings in future)
- Anonymous feedback maintains user privacy even within unions

## Testing

### Manual Testing
1. Create a test user account
2. Browse available unions
3. Join and leave unions
4. Test search and filter functionality
5. Verify member counts update correctly

### Automated Testing
Consider adding tests for:
- Union creation
- Membership operations (join/leave)
- Filtering and search
- Permission checks
- Duplicate membership prevention

## Troubleshooting

### "Union not found" Error
- Verify union ID is correct
- Check if union exists in database

### Cannot Join Union
- Ensure you're authenticated
- Check if already a member
- Verify backend is running

### Industries Not Loading
- Run migration script
- Create sample unions with industries
- Check API endpoint `/api/unions/industries`

### Search Not Working
- Ensure search query is properly encoded
- Check backend logs for SQL errors
- Verify unions have searchable content

## Support
For issues or questions, please:
1. Check backend logs for errors
2. Verify database migrations ran successfully
3. Ensure all dependencies are installed
4. Review API responses in browser DevTools

---

Last Updated: November 8, 2025
