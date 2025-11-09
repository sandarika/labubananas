"""
Backend package initializer.

This file makes `backend` an importable Python package so relative imports like
`from .routes import api_router` work reliably when running uvicorn from the
repository root or another working directory.
"""

__all__ = ["db", "main", "models", "routes"]
