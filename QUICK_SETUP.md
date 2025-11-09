# Quick Setup Guide for Union Features

## Step-by-Step Setup

### 1. Database Migration
Run the migration script to add new columns and tables:

```bash
cd backend
python migrate_unions.py
```

Expected output:
```
Starting migration...
✓ Added industry column to unions table
✓ Added tags column to unions table
✓ Created union_members table
Migration completed!
```

### 2. Create Sample Data (Optional but Recommended)
Populate the database with example unions for testing:

```bash
python create_sample_unions.py
```

This creates 10 diverse sample unions across different industries.

### 3. Start the Backend Server

```bash
# From the backend directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or if you have a different startup command, use that instead.

### 4. Start the Frontend

```bash
# From the frontend directory
cd ../frontend
npm install  # if needed
npm run dev
```

### 5. Test the New Features

1. Open your browser to `http://localhost:3000`
2. Sign in to your account
3. Click on "Unions" in the navigation bar
4. Browse, search, and join unions!

## Verification Checklist

- [ ] Migration script ran without errors
- [ ] Sample unions created (check database or API)
- [ ] Backend server running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can access `/unions` page
- [ ] Can search for unions
- [ ] Can filter by industry
- [ ] Can join a union
- [ ] Can leave a union
- [ ] Member count updates correctly

## Quick API Test

Test the API directly:

```bash
# Get all unions
curl http://localhost:8000/api/unions/

# Get industries
curl http://localhost:8000/api/unions/industries

# Get specific union (replace 1 with actual ID)
curl http://localhost:8000/api/unions/1
```

## Troubleshooting

### Backend won't start
- Check if port 8000 is already in use
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check for Python version compatibility

### Migration errors
- Make sure the database file exists
- Check file permissions
- Backup your database before running migrations

### Frontend won't start
- Run `npm install` to install dependencies
- Check if port 3000 is available
- Clear npm cache if needed: `npm cache clean --force`

### Can't see unions page
- Verify you're signed in
- Check browser console for errors
- Ensure backend API is accessible

## Next Steps

1. **Customize Sample Unions**: Edit `create_sample_unions.py` to match your needs
2. **Add More Industries**: Create unions with new industry types
3. **Integrate with Posts**: Connect union membership with forum posts
4. **Add Union Events**: Link unions with the calendar system
5. **Create Union Polls**: Make polls specific to union members

## File Changes Summary

### Backend Files Modified:
- `backend/models.py` - Added industry, tags to Union; created UnionMember model
- `backend/schemas.py` - Enhanced Union schema with new fields
- `backend/routes/unions.py` - Added join/leave/filter endpoints

### Backend Files Created:
- `backend/migrate_unions.py` - Database migration script
- `backend/create_sample_unions.py` - Sample data generator

### Frontend Files Modified:
- `frontend/lib/api.ts` - Updated Union types and added new API methods
- `frontend/components/navbar.tsx` - Added "Unions" link to navigation

### Frontend Files Created:
- `frontend/app/unions/page.tsx` - Main unions browsing page

### Documentation Created:
- `UNION_FEATURES.md` - Comprehensive feature documentation
- `QUICK_SETUP.md` - This file

## Support

If you encounter issues:
1. Check the main `UNION_FEATURES.md` documentation
2. Review backend logs for errors
3. Check browser DevTools console
4. Verify database schema with `sqlite3 bunch_up.db .schema` (if using SQLite)

Happy organizing! 🍌✊
