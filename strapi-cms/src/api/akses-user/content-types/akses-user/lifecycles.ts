export default {
  async afterCreate(event: any) {
    const { result } = event;
    if (!result) return;

    // Trigger notification on Strapi if user account is pending approval
    if (result.status_akses === 'pending') {
      try {
        const userName = result.nama_lengkap_input || 'Pengguna Baru';
        const userEmail = result.email || '-';
        const requestedRole = result.role || 'member';

        await strapi.documents('api::notification.notification').create({
          data: {
            type: 'warning',
            title: 'Pengajuan Akun Baru Perlu Verifikasi',
            message: `Pengguna ${userName} (${userEmail}) mengajukan akses MUBES dengan role '${requestedRole}'. Mohon ditinjau dan disetujui/ditolak via Content Manager.`,
            source: 'strapi',
            read: false,
            timestamp: new Date().toISOString(),
            data: {
              clerk_user_id: result.clerk_user_id,
              email: result.email,
              nama_lengkap: result.nama_lengkap_input,
              role_diajukan: result.role,
              document_id: result.documentId,
            },
          },
        });
        strapi.log.info(`[AksesUser Lifecycles] Notification created for pending user: ${userEmail}`);
      } catch (notifErr: any) {
        strapi.log.error(`[AksesUser Lifecycles] Failed to create notification: ${notifErr.message}`);
      }
    }
  },

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
              status: result.status_akses,
              role: result.role,
            },
          }),
        }
      );

      if (!response.ok) {
        strapi.log.error(`[AksesUser Lifecycles] Failed to sync Clerk metadata for user ${result.clerk_user_id}: ${response.statusText}`);
      } else {
        strapi.log.info(`[AksesUser Lifecycles] Successfully synced Clerk metadata for user ${result.clerk_user_id} -> status: ${result.status_akses}, role: ${result.role}`);
      }
    } catch (err: any) {
      strapi.log.error(`[AksesUser Lifecycles] Clerk metadata sync exception: ${err.message}`);
    }
  },
};
