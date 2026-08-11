import { fetchStrapiAPI, getStrapiMediaUrl } from '@/lib/strapi';
import { committeeData as fallbackCommitteeData, type Division, type Member } from '@/data/committee';

export interface EdufestConfig {
  title: string;
  tagline: string;
  eventDate: string;
  aboutTitle: string;
  aboutText: string;
  selayangTitle: string;
  selayangText: string;
  backgroundAudioUrl: string;
  logoUrl: string;
  locationName: string;
  mapsEmbedUrl: string;
  scenes: {
    scene_id: string;
    title?: string;
    subtitle?: string;
    content?: string;
    active?: boolean;
  }[];
}

export interface TimelineGuest {
  name: string;
  src: string;
  objectPosition?: string;
}

export interface TimelineItemData {
  year: string;
  date: string;
  theme: string;
  participants: string;
  guests: TimelineGuest[];
}

const FALLBACK_TIMELINE: TimelineItemData[] = [
  {
    year: "2017",
    date: "19 Februari 2017",
    theme: "Pentas Seni, Perlombaan, Penggalangan Dana",
    participants: "500 (Peserta & Audiens)",
    guests: [
      { name: "Shoutul Harokah", src: "/assets/timeline/Shoutul%20Harokah.jpg", objectPosition: "50% 35%" },
      { name: "Ebith Beat A", src: "/assets/timeline/Ebith%20Beat%20A.jpg" }
    ]
  },
  {
    year: "2018",
    date: "16–17 Februari 2018",
    theme: "It’s Time To Shine",
    participants: "625 (Peserta & Audiens)",
    guests: [
      { name: "Ust. Zae Hannan", src: "/assets/timeline/Ust.%20Zae%20Hannan.jpg" },
      { name: "Syekh Nashif Nashir", src: "/assets/timeline/Syekh%20Nashif%20Nashir.jpg" },
      { name: "Ali Sastra", src: "/assets/timeline/Ali%20Sastra.jpg" }
    ]
  },
  {
    year: "2019",
    date: "16–17 Februari 2019",
    theme: "Prove Our Ability Show Our Creativity",
    participants: "760 (Peserta & Audiens)",
    guests: [
      { name: "Ridwan Hafidz", src: "/assets/timeline/Ridwan%20Hafidz.jpg" },
      { name: "Ibnu The Jenggot", src: "/assets/timeline/Ibnu%20The%20Jenggot.jpg" }
    ]
  },
  {
    year: "2020",
    date: "14 Februari 2020",
    theme: "ANAGATA: Today For The Future",
    participants: "800 (Peserta & Audiens)",
    guests: [
      { name: "Kang Yan Hidayatullah", src: "/assets/timeline/Kang%20Yan%20Hidayatullah.jpg" },
      { name: "Aleehya", src: "/assets/timeline/Aleehya.jpg" }
    ]
  },
  {
    year: "2023",
    date: "13–14 Februari 2023",
    theme: "Universe: Be The Best In The Universe (Kajian Palestina, Bazaar)",
    participants: "900 (Peserta & Audiens)",
    guests: [
      { name: "Genya", src: "/assets/timeline/Genya.jpg" },
      { name: "Ust. Handy Bonny", src: "/assets/timeline/Ust.%20Handy%20Bonny.jpg" }
    ]
  },
  {
    year: "2024",
    date: "18–19 Februari 2024",
    theme: "Unity: Unity In Diversity",
    participants: "1000 (Peserta & Audiens)",
    guests: [
      { name: "Ustadzah Haneen Akira", src: "/assets/timeline/Ustadzah%20Haneen%20Akira.jpg" }
    ]
  },
  {
    year: "2025",
    date: "13–14 Februari 2025",
    theme: "Aidentity: Amazing Intelligence, Delightful Entertain and Humanity",
    participants: "1500 (Peserta & Audiens)",
    guests: [
      { name: "Fajri (Unity)", src: "/assets/timeline/Fajri%20(unity).jpg" },
      { name: "Zein Permana", src: "/assets/timeline/Zein%20Permana.jpg", objectPosition: "50% 35%" },
      { name: "Ray Shareza", src: "/assets/timeline/Ray%20Shareza.jpg" }
    ]
  },
  {
    year: "2026",
    date: "13–14 Februari 2026",
    theme: "Infinity: Growing Talents Beyond Infinity",
    participants: "To Be Continued",
    guests: []
  }
];

export async function getEdufestConfig(): Promise<EdufestConfig> {
  const defaultConfig: EdufestConfig = {
    title: 'INFINITY - Edufest 2025',
    tagline: 'Growing Talents Beyond Infinity',
    eventDate: '13-14 Februari 2025',
    aboutTitle: 'About Edufest',
    aboutText: 'Edufest merupakan event rutin yang dilaksanakan oleh SMA IT Fithrah Insani dan SMK Informatika Fithrah Insani yang berisi kegiatan perlombaan untuk mewadahi bakat kreatif Siswa/i SMP/MTs sederajat dalam bidang Pendidikan dan Teknologi, serta melatih meningkatkan kepedulian terhadap sesama manusia melalui kegiatan amal.',
    selayangTitle: 'Selayang Pandang',
    selayangText: 'Tema "Ketakterbatasan Potensi Bakat Remaja" diangkat karena kekhawatiran mengenai remaja Indonesia yang takut mencoba hal baru, keluar dari zona nyamannya, dan malu peduli dengan lingkungan sekitar.',
    backgroundAudioUrl: '/sounds/Aidentity.mp3',
    logoUrl: '/images/logo-infinity.png',
    locationName: 'SMA dan SMK Fithrah Insani',
    mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2984.2941894147434!2d107.52111289259334!3d-6.8650087692923354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e489587729b1%3A0xa3166256027d8007!2sSMA%20dan%20SMK%20Fithrah%20Insani!5e1!3m2!1sid!2sid!4v1767604243358!5m2!1sid!2sid',
    scenes: []
  };

  try {
    const res: any = await fetchStrapiAPI('/api/edufest-config?populate=*');
    const data = res?.data;
    if (data) {
      const attrs = data.attributes || data;
      return {
        title: attrs.title || defaultConfig.title,
        tagline: attrs.tagline || defaultConfig.tagline,
        eventDate: attrs.event_date || defaultConfig.eventDate,
        aboutTitle: attrs.about_title || defaultConfig.aboutTitle,
        aboutText: attrs.about_text || defaultConfig.aboutText,
        selayangTitle: attrs.selayang_title || defaultConfig.selayangTitle,
        selayangText: attrs.selayang_text || defaultConfig.selayangText,
        backgroundAudioUrl: getStrapiMediaUrl(attrs.background_audio, defaultConfig.backgroundAudioUrl),
        logoUrl: getStrapiMediaUrl(attrs.logo, defaultConfig.logoUrl),
        locationName: attrs.location_name || defaultConfig.locationName,
        mapsEmbedUrl: attrs.maps_embed_url || defaultConfig.mapsEmbedUrl,
        scenes: attrs.scenes || []
      };
    }
  } catch (err) {
    console.warn('[EdufestAPI] Could not fetch edufest-config from Strapi, using fallback:', err);
  }

  return defaultConfig;
}

export async function getEdufestCommittee(): Promise<Division[]> {
  try {
    const res: any = await fetchStrapiAPI('/api/edufest-divisions?populate[members][populate]=*&sort[0]=order:asc');
    const items = res?.data || [];
    if (items.length > 0) {
      return items.map((item: any) => {
        const attrs = item.attributes || item;
        const rawMembers = attrs.members?.data || attrs.members || [];
        const members: Member[] = rawMembers.map((m: any) => {
          const mAttrs = m.attributes || m;
          const photoUrl = getStrapiMediaUrl(mAttrs.photo, undefined);
          const cardUrl = getStrapiMediaUrl(mAttrs.card_photo, undefined);
          const extraPhotos: string[] = (mAttrs.photos?.data || mAttrs.photos || []).map((p: any) => getStrapiMediaUrl(p, '')).filter(Boolean);

          let photosArr: string[] | undefined = undefined;
          if (extraPhotos.length > 0) {
            photosArr = extraPhotos;
          } else if (photoUrl || cardUrl) {
            photosArr = [photoUrl || cardUrl!, cardUrl || photoUrl!];
          }

          return {
            id: String(m.id || mAttrs.id || mAttrs.name),
            name: mAttrs.name,
            role: mAttrs.role || undefined,
            photo: photoUrl,
            photos: photosArr
          };
        });

        return {
          id: attrs.slug || String(item.id),
          label: attrs.name,
          type: attrs.type || 'division',
          coordinator: attrs.coordinator_name || undefined,
          members
        };
      });
    }
  } catch (err) {
    console.warn('[EdufestAPI] Could not fetch edufest-divisions from Strapi, using fallback:', err);
  }

  return fallbackCommitteeData;
}

export async function getEdufestTimeline(): Promise<TimelineItemData[]> {
  try {
    const res: any = await fetchStrapiAPI('/api/edufest-timelines?populate[guests][populate]=*&sort[0]=order:asc');
    const items = res?.data || [];
    if (items.length > 0) {
      return items.map((item: any) => {
        const attrs = item.attributes || item;
        const rawGuests = attrs.guests || [];
        const guests: TimelineGuest[] = rawGuests.map((g: any) => {
          const gAttrs = g.attributes || g;
          const src = getStrapiMediaUrl(gAttrs.photo, `/assets/timeline/${encodeURIComponent(gAttrs.name)}.jpg`);
          return {
            name: gAttrs.name,
            src,
            objectPosition: gAttrs.object_position || undefined
          };
        });

        return {
          year: attrs.year,
          date: attrs.date_label || attrs.year,
          theme: attrs.theme || '',
          participants: attrs.participants || '',
          guests
        };
      });
    }
  } catch (err) {
    console.warn('[EdufestAPI] Could not fetch edufest-timelines from Strapi, using fallback:', err);
  }

  return FALLBACK_TIMELINE;
}
