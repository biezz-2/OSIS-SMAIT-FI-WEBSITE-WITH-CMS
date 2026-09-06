export default {
  async afterUpdate(event: any) {
    const { result } = event;
    if (!result?.clerk_user_id || !process.env.CLERK_SECRET_KEY) return;

    try {
      const response = await fetch(
        `https://api.clerk.com/v1/users/${result.clerk_user_id}/metadata`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
          body: JSON.stringify({
            public_metadata: {
              status: result.status,
              role: result.role,
            },
          }),
        }
      );

      if (!response.ok) {
        strapi.log.error(`[AksesUser Lifecycles] Failed to sync Clerk metadata for user ${result.clerk_user_id}: ${response.statusText}`);
      } else {
        strapi.log.info(`[AksesUser Lifecycles] Successfully synced Clerk metadata for user ${result.clerk_user_id} -> status: ${result.status}, role: ${result.role}`);
      }
    } catch (err: any) {
      strapi.log.error(`[AksesUser Lifecycles] Clerk metadata sync exception: ${err.message}`);
    }
  },
};
