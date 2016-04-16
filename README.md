# Visage Backend
> Backend JSON API for Visage

Visage is an intelligent financial assistant that allows you to handle all of your Visa card needs through various outlets, whether it be Facebook Messenger or Slack! With Visage, you can:

* Account information
* Authorize a friend to use my Visa debit/credit card up to a certain limit
* Over-time goals
    * Vacation Planning
    * Shopping for an item

## API Endpoints
All API endpoints are prefixed with `/api/<versionNumber>`.

1. **POST** `/fbHook`
    * Primary Webhook URL for Facebook Messenger
    * 