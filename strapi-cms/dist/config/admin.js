"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPreviewPathname = (uid, document) => {
    if (!document)
        return null;
    switch (uid) {
        case 'api::halaman.halaman': {
            const slug = document.slug || '';
            if (['beranda', 'home', 'halaman-utama'].includes(slug))
                return '/';
            if (['tentang-kami', 'about'].includes(slug))
                return '/about';
            if (slug === 'sekbid')
                return '/sekbid';
            if (slug === 'program-kerja')
                return '/program-kerja';
            if (slug === 'anggota')
                return '/anggota';
            if (slug === 'galeri')
                return '/galeri';
            if (slug === 'media-sosial')
                return '/media-sosial';
            if (slug === 'edufest-infinity')
                return '/edufest-infinity';
            return `/${slug}`;
        }
        case 'api::sekbid.sekbid': {
            return document.slug ? `/sekbid/${document.slug}` : (document.nomor ? `/sekbid/${document.nomor}` : '/sekbid');
        }
        case 'api::program-kerja.program-kerja': {
            return document.slug ? `/program-kerja/${document.slug}` : '/program-kerja';
        }
        case 'api::anggota-osis.anggota-osis': {
            return '/anggota';
        }
        case 'api::galeri-foto.galeri-foto': {
            return '/galeri';
        }
        case 'api::artikel-mading.artikel-mading': {
            return document.slug ? `/mading/${document.slug}` : '/';
        }
        case 'api::event.event': {
            return '/edufest-infinity';
        }
        default:
            return null;
    }
};
const config = ({ env }) => ({
    auth: {
        secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
        salt: env('API_TOKEN_SALT'),
    },
    transfer: {
        token: {
            salt: env('TRANSFER_TOKEN_SALT'),
        },
    },
    secrets: {
        encryptionKey: env('ENCRYPTION_KEY'),
    },
    flags: {
        nps: env.bool('FLAG_NPS', true),
        promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
    preview: {
        enabled: true,
        config: {
            allowedOrigins: [
                env('CLIENT_URL', 'https://osis.biezz.my.id'),
                env('FRONTEND_URL', 'http://localhost:3000'),
                'http://localhost:3000',
                'https://osis.biezz.my.id',
                'https://osisstrapi.biezz.my.id',
            ],
            async handler(uid, { documentId, locale, status }) {
                if (!documentId)
                    return null;
                // In Strapi 5 document service, specify status ('draft' or 'published') so findOne doesn't return null for unpublished drafts
                let document = await strapi.documents(uid).findOne({
                    documentId,
                    status: status || 'draft',
                });
                if (!document) {
                    document = await strapi.documents(uid).findOne({ documentId, status: 'draft' });
                }
                if (!document) {
                    document = await strapi.documents(uid).findOne({ documentId, status: 'published' });
                }
                if (!document)
                    return null;
                const pathname = getPreviewPathname(uid, document);
                if (!pathname)
                    return null;
                const clientUrl = env('CLIENT_URL', env('FRONTEND_URL', 'https://osis.biezz.my.id'));
                const previewSecret = env('PREVIEW_SECRET', 'preview_secret_agoraacta_2026');
                const urlSearchParams = new URLSearchParams({
                    url: pathname,
                    secret: previewSecret,
                    status: status || 'draft',
                });
                return `${clientUrl}/api/preview?${urlSearchParams.toString()}`;
            },
        },
    },
});
exports.default = config;
