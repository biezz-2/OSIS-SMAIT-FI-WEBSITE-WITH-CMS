import type { Schema, Struct } from '@strapi/strapi';

export interface EdufestGuest extends Struct.ComponentSchema {
  collectionName: 'components_edufest_guests';
  info: {
    description: 'Guest Star untuk Edufest Timeline';
    displayName: 'Guest Star';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    object_position: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'50% 50%'>;
    photo: Schema.Attribute.Media<'images'>;
  };
}

export interface EdufestScene extends Struct.ComponentSchema {
  collectionName: 'components_edufest_scenes';
  info: {
    description: 'Pengaturan Scene Landing Page Edufest';
    displayName: 'Edufest Scene';
  };
  attributes: {
    active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    content: Schema.Attribute.Text;
    media: Schema.Attribute.Media<
      'images' | 'videos' | 'audios' | 'files',
      true
    >;
    scene_id: Schema.Attribute.String & Schema.Attribute.Required;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedTujuanDetail extends Struct.ComponentSchema {
  collectionName: 'components_shared_tujuan_details';
  info: {
    description: '';
    displayName: 'Tujuan Detail';
  };
  attributes: {
    deskripsi: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'edufest.guest': EdufestGuest;
      'edufest.scene': EdufestScene;
      'shared.tujuan-detail': SharedTujuanDetail;
    }
  }
}
