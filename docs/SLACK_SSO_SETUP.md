# Setting Up Slack SSO for Briefly

This guide will walk you through setting up Slack Single Sign-On (SSO) for the Briefly application using Clerk authentication.

## Prerequisites

- A Slack workspace where you have admin privileges
- A Clerk account and application set up
- Your Briefly Next.js application codebase

## Development Environment Setup

For development, Clerk provides pre-configured shared OAuth credentials and redirect URIs, which simplifies the setup process.

1. Go to the [Clerk Dashboard](https://dashboard.clerk.dev)
2. Select your application
3. Navigate to **User & Authentication > Social Connections**
4. Look for Slack in the list of providers
5. Click **Add connection** and select **For all users**
6. In the dropdown, select **Slack**
7. Click **Add connection**

That's it! For development, Clerk will handle the OAuth process for you. However, note that using shared credentials means users will be asked to authorize the OAuth application every time they sign in.

## Production Environment Setup

For production, you'll need to provide your own Slack OAuth credentials.

### Step 1: Configure Clerk for Slack OAuth

1. Go to the [Clerk Dashboard](https://dashboard.clerk.dev)
2. Select your application
3. Navigate to **User & Authentication > Social Connections**
4. Look for Slack in the list of providers
5. Click **Add connection** and select **For all users**
6. In the dropdown, select **Slack**
7. Ensure both **Enable for sign-up and sign-in** and **Use custom credentials** are toggled on
8. Copy the **Redirect URL** shown in the modal and save it for later

### Step 2: Create a Slack App

1. Go to the [Slack API Platform](https://api.slack.com/apps)
2. Click **Create New App**
3. Select **From scratch** and provide your app details:
   - App Name: Briefly (or your preferred name)
   - Development Slack Workspace: Select your workspace
4. Click **Create App**
5. On the **Basic Information** page, note the **Client ID** and **Client Secret**
6. In the sidebar, navigate to **OAuth & Permissions**
7. Scroll down to the **Redirect URLs** section and click **Add New Redirect URL**
8. Paste the **Redirect URL** you copied from the Clerk Dashboard
9. Click **Add** and then **Save URLs**
10. Scroll down to **Scopes** and add the following OAuth scopes under **User Token Scopes**:
    - `identity.basic`: View basic information about the user
    - `identity.email`: View the user's email address
    - `identity.team`: View the user's Slack workspace name and info
11. Click **Save Changes**

### Step 3: Configure Clerk with Slack Credentials

1. Return to the Clerk Dashboard where you left the modal open
2. Enter the **Client ID** and **Client Secret** values from your Slack app
3. Click **Add connection**

If you closed the modal, you can:

1. Go to the **Social Connections** page
2. Click on the settings icon for Slack
3. Enable **Use custom credentials** if not already enabled
4. Enter your Slack app's **Client ID** and **Client Secret**
5. Click **Save**

### Step 4: Update Environment Variables

Ensure your `.env.local` file (and your production environment variables) include these settings:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_public_clerk_key
CLERK_SECRET_KEY=your_private_clerk_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Testing Your Integration

1. Run your Next.js application: `npm run dev`
2. Navigate to `/custom-sign-in` or `/sign-in`
3. Click on the **Continue with Slack** button
4. Authorize your Slack app when prompted
5. You should be successfully authenticated and redirected to your dashboard

## Troubleshooting

If you encounter issues with the Slack SSO integration:

- Verify that your Redirect URLs match exactly in both Clerk and Slack
- Ensure you've added all the necessary OAuth scopes to your Slack app
- Check that your Client ID and Client Secret are entered correctly in Clerk
- For development environment issues, try creating your own Slack app and custom credentials
- Verify that your environment variables are properly set up and loaded
- Review the browser console and server logs for any error messages
- Check that your Clerk middleware is properly configured

## Additional Resources

- [Clerk Documentation - Add Slack as a social connection](https://clerk.com/docs/authentication/social-connections/slack)
- [Slack API Documentation - OAuth](https://api.slack.com/authentication/oauth-v2)
- [Next.js Authentication with Clerk](https://clerk.com/docs/nextjs/overview) 