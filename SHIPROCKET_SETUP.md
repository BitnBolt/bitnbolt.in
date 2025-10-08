# Shiprocket Integration Setup

This document explains how to configure Shiprocket integration for the BitnBolt platform.

## Overview

The platform uses a single Shiprocket account for all vendors. All shipping operations are handled through one centralized account with credentials stored in environment variables.

## Environment Variables

Add the following environment variables to your deployment:

### Required Variables

```bash
# Shiprocket Account Credentials
SHIPROCKET_EMAIL=your-shiprocket-email@example.com
SHIPROCKET_PASSWORD=your-shiprocket-password

# Pickup Location Details
SHIPROCKET_PICKUP_NAME=BitnBolt
SHIPROCKET_PICKUP_PHONE=+91-9876543210
SHIPROCKET_PICKUP_ADDRESS=Your Warehouse Address
SHIPROCKET_PICKUP_CITY=Your City
SHIPROCKET_PICKUP_STATE=Your State
SHIPROCKET_PICKUP_PINCODE=123456
SHIPROCKET_PICKUP_COUNTRY=India
```

### Optional Variables

```bash
# If you want to override the default country
SHIPROCKET_PICKUP_COUNTRY=India
```

## How It Works

1. **Single Account**: All vendors use the same Shiprocket account
2. **Environment Configuration**: Credentials are stored securely in environment variables
3. **Automatic Token Management**: The system automatically handles authentication and token refresh
4. **Centralized Pickup**: All shipments are picked up from the configured location

## Features

- ✅ Automatic shipment creation
- ✅ AWB generation
- ✅ Real-time tracking
- ✅ Token management with automatic refresh
- ✅ Error handling and logging

## API Endpoints

- `POST /api/shiprocket/create-shipment` - Create shipment for an order
- `POST /api/shiprocket/generate-awb` - Generate AWB for tracking
- `GET /api/shiprocket/track` - Get tracking details

## Admin Configuration

The admin panel shows information about Shiprocket configuration but doesn't allow direct editing since credentials are managed via environment variables for security.

## Security Notes

- Never commit Shiprocket credentials to version control
- Use environment variables for all sensitive data
- Regularly rotate your Shiprocket password
- Monitor API usage and costs

## Troubleshooting

### Common Issues

1. **Authentication Failed**: Check your email and password
2. **Pickup Location Error**: Verify all pickup location fields are set
3. **Token Expired**: The system automatically refreshes tokens, but check your credentials if issues persist

### Logs

Check the server logs for detailed error messages when troubleshooting Shiprocket integration issues.
