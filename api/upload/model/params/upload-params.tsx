import { Transform } from 'stream';

    /****************************** Constants *************************************/
    /****************************** Transformations *******************************/
    type CropMode =
        | (string & {})
        | "scale"
        | "fit"
        | "limit"
        | "mfit"
        | "fill"
        | "lfill"
        | "pad"
        | "lpad"
        | "mpad"
        | "crop"
        | "thumb"
        | "imagga_crop"
        | "imagga_scale";
    type Gravity =
        | (string & {})
        | "north_west"
        | "north"
        | "north_east"
        | "west"
        | "center"
        | "east"
        | "south_west"
        | "south"
        | "south_east"
        | "xy_center"
        | "face"
        | "face:center"
        | "face:auto"
        | "faces"
        | "faces:center"
        | "faces:auto"
        | "body"
        | "body:face"
        | "adv_face"
        | "adv_faces"
        | "adv_eyes"
        | "custom"
        | "custom:face"
        | "custom:faces"
        | "custom:adv_face"
        | "custom:adv_faces"
        | "auto"
        | "auto:adv_face"
        | "auto:adv_faces"
        | "auto:adv_eyes"
        | "auto:body"
        | "auto:face"
        | "auto:faces"
        | "auto:custom_no_override"
        | "auto:none"
        | "liquid"
        | "ocr_text";
    type Angle = number | (string & {}) | Array<number | string> | "auto_right" | "auto_left" | "ignore" | "vflip" | "hflip";
    type ImageEffect =
        | (string & {})
        | "hue"
        | "red"
        | "green"
        | "blue"
        | "negate"
        | "brightness"
        | "auto_brightness"
        | "brightness_hsb"
        | "sepia"
        | "grayscale"
        | "blackwhite"
        | "saturation"
        | "colorize"
        | "replace_color"
        | "simulate_colorblind"
        | "assist_colorblind"
        | "recolor"
        | "tint"
        | "contrast"
        | "auto_contrast"
        | "auto_color"
        | "vibrance"
        | "noise"
        | "ordered_dither"
        | "pixelate_faces"
        | "pixelate_region"
        | "pixelate"
        | "unsharp_mask"
        | "sharpen"
        | "blur_faces"
        | "blur_region"
        | "blur"
        | "tilt_shift"
        | "gradient_fade"
        | "vignette"
        | "anti_removal"
        | "overlay"
        | "mask"
        | "multiply"
        | "displace"
        | "shear"
        | "distort"
        | "trim"
        | "make_transparent"
        | "shadow"
        | "viesus_correct"
        | "fill_light"
        | "gamma"
        | "improve";

    type VideoEffect = (string & {}) | "accelerate" | "reverse" | "boomerang" | "loop" | "make_transparent" | "transition";
    type AudioCodec = (string & {}) | "none" | "aac" | "vorbis" | "mp3";
    type AudioFrequency =
        string
        | (number & {})
        | 8000
        | 11025
        | 16000
        | 22050
        | 32000
        | 37800
        | 44056
        | 44100
        | 47250
        | 48000
        | 88200
        | 96000
        | 176400
        | 192000;
    /****************************** Flags *************************************/
    type ImageFlags =
        | (string & {})
        | Array<string>
        | "any_format"
        | "attachment"
        | "apng"
        | "awebp"
        | "clip"
        | "clip_evenodd"
        | "cutter"
        | "force_strip"
        | "getinfo"
        | "ignore_aspect_ratio"
        | "immutable_cache"
        | "keep_attribution"
        | "keep_iptc"
        | "layer_apply"
        | "lossy"
        | "preserve_transparency"
        | "png8"
        | "png32"
        | "progressive"
        | "rasterize"
        | "region_relative"
        | "relative"
        | "replace_image"
        | "sanitize"
        | "strip_profile"
        | "text_no_trim"
        | "no_overflow"
        | "text_disallow_overflow"
        | "tiff8_lzw"
        | "tiled";
    type VideoFlags =
        | (string & {})
        | Array<string>
        | "animated"
        | "awebp"
        | "attachment"
        | "streaming_attachment"
        | "hlsv3"
        | "keep_dar"
        | "splice"
        | "layer_apply"
        | "no_stream"
        | "mono"
        | "relative"
        | "truncate_ts"
        | "waveform";
    type ColorSpace = (string & {}) | "srgb" | "no_cmyk" | "keep_cmyk";
    type DeliveryType =
        | (string & {})
        | "upload"
        | "private"
        | "authenticated"
        | "fetch"
        | "multi"
        | "text"
        | "asset"
        | "list"
        | "facebook"
        | "twitter"
        | "twitter_name"
        | "instagram"
        | "gravatar"
        | "youtube"
        | "hulu"
        | "vimeo"
        | "animoto"
        | "worldstarhiphop"
        | "dailymotion";
    /****************************** URL *************************************/
    type ResourceType = (string & {}) | "image" | "raw" | "video";
    type ImageFormat =
        | (string & {})
        | "gif"
        | "png"
        | "jpg"
        | "bmp"
        | "ico"
        | "pdf"
        | "tiff"
        | "eps"
        | "jpc"
        | "jp2"
        | "psd"
        | "webp"
        | "zip"
        | "svg"
        | "webm"
        | "wdp"
        | "hpx"
        | "djvu"
        | "ai"
        | "flif"
        | "bpg"
        | "miff"
        | "tga"
        | "heic"
    type VideoFormat =
        | (string & {})
        | "auto"
        | "flv"
        | "m3u8"
        | "ts"
        | "mov"
        | "mkv"
        | "mp4"
        | "mpd"
        | "ogv"
        | "webm"

    export interface CommonTransformationOptions {
        transformation?: TransformationOptions;
        raw_transformation?: string;
        crop?: CropMode;
        width?: number | string;
        height?: number | string;
        size?: string;
        aspect_ratio?: number | string;
        gravity?: Gravity;
        x?: number | string;
        y?: number | string;
        zoom?: number | string;
        effect?: string | Array<number | string>;
        background?: string;
        angle?: Angle;
        radius?: number | string;
        overlay?: string | object; //might be Record<any, any>
        custom_function?: string | { function_type: (string & {}) | "wasm" | "remote", source: string }
        variables?: Array<string | object>; //might be Record<any, any>
        if?: string;
        else?: string;
        end_if?: string;
        dpr?: number | string;
        quality?: number | string;
        delay?: number | string;

        [futureKey: string]: any;
    }

    export interface ImageTransformationOptions extends CommonTransformationOptions {
        underlay?: string | Object; //might be Record<any, any>
        color?: string;
        color_space?: ColorSpace;
        opacity?: number | string;
        border?: string;
        default_image?: string;
        density?: number | string;
        format?: ImageFormat;
        fetch_format?: ImageFormat;
        effect?: string | Array<number | string> | ImageEffect;
        page?: number | string;
        flags?: ImageFlags | string;

        [futureKey: string]: any;
    }

    interface VideoTransformationOptions extends CommonTransformationOptions {
        audio_codec?: AudioCodec;
        audio_frequency?: AudioFrequency;
        video_codec?: string | Object; //might be Record<any, any>
        bit_rate?: number | string;
        fps?: string | Array<number | string>;
        keyframe_interval?: string;
        offset?: string,
        start_offset?: number | string;
        end_offset?: number | string;
        duration?: number | string;
        streaming_profile?: StreamingProfiles
        video_sampling?: number | string;
        format?: VideoFormat;
        fetch_format?: VideoFormat;
        effect?: string | Array<number | string> | VideoEffect;
        flags?: VideoFlags;

        [futureKey: string]: any;
    }

    interface TextStyleOptions {
        text_style?: string;
        font_family?: string;
        font_size?: number;
        font_color?: string;
        font_weight?: string;
        font_style?: string;
        background?: string;
        opacity?: number;
        text_decoration?: string
    }

    interface ConfigOptions {
        cloud_name?: string;
        api_key?: string;
        api_secret?: string;
        api_proxy?: string;
        private_cdn?: boolean;
        secure_distribution?: string;
        force_version?: boolean;
        ssl_detected?: boolean;
        secure?: boolean;
        cdn_subdomain?: boolean;
        secure_cdn_subdomain?: boolean;
        cname?: string;
        shorten?: boolean;
        sign_url?: boolean;
        long_url_signature?: boolean;
        use_root_path?: boolean;
        auth_token?: AuthTokenApiOptions;
        account_id?: string;
        provisioning_api_key?: string;
        provisioning_api_secret?: string;
        oauth_token?: string;

        [futureKey: string]: any;
    }

    export interface ResourceOptions {
        type?: string;
        resource_type?: string;
    }

    export interface UrlOptions extends ResourceOptions {
        version?: string;
        format?: string;
        url_suffix?: string;

        [futureKey: string]: any;
    }

    export interface ImageTagOptions {
        html_height?: string;
        html_width?: string;
        srcset?: object; //might be Record<any, any>
        attributes?: object; //might be Record<any, any>
        client_hints?: boolean;
        responsive?: boolean;
        hidpi?: boolean;
        responsive_placeholder?: boolean;

        [futureKey: string]: any;
    }

    export interface VideoTagOptions {
        source_types?: string | string[];
        source_transformation?: TransformationOptions;
        fallback_content?: string;
        poster?: string | object; //might be Record<any, any>
        controls?: boolean;
        preload?: string;

        [futureKey: string]: any;
    }

    /****************************** Admin API Options *************************************/
    export interface AdminApiOptions {
        agent?: object; //might be Record<any, any>
        content_type?: string;
        oauth_token?: string;

        [futureKey: string]: any;
    }

    export interface ArchiveApiOptions {
        allow_missing?: boolean;
        async?: boolean;
        expires_at?: number;
        flatten_folders?: boolean;
        flatten_transformations?: boolean;
        keep_derived?: boolean;
        mode?: string;
        notification_url?: string;
        prefixes?: string;
        public_ids?: string[] | string;
        fully_qualified_public_ids?: string[] | string;
        skip_transformation_name?: boolean;
        tags?: string | string[];
        target_format?: TargetArchiveFormat;
        target_public_id?: string;
        target_tags?: string[];
        timestamp?: number;
        transformations?: TransformationOptions;
        type?: DeliveryType
        use_original_filename?: boolean;

        [futureKey: string]: any;
    }

    export interface UpdateApiOptions extends ResourceOptions {
        access_control?: string[];
        auto_tagging?: number;
        background_removal?: string;
        categorization?: string;
        context?: boolean | string;
        custom_coordinates?: string;
        detection?: string;
        face_coordinates?: string;
        headers?: string;
        notification_url?: string;
        ocr?: string;
        raw_convert?: string;
        similarity_search?: string;
        tags?: string | string[];
        moderation_status?: string;
        unsafe_update?: object; //might be Record<any, any>
        allowed_for_strict?: boolean;
        asset_folder?: string;
        unique_display_name?: boolean;
        display_name?: string

        [futureKey: string]: any;
    }

    export interface PublishApiOptions extends ResourceOptions {
        invalidate?: boolean;
        overwrite?: boolean;

        [futureKey: string]: any;
    }

    export interface ResourceApiOptions extends ResourceOptions {
        transformation?: TransformationOptions;
        transformations?: TransformationOptions;
        keep_original?: boolean;
        next_cursor?: boolean | string;
        public_ids?: string[];
        prefix?: string;
        all?: boolean;
        max_results?: number;
        tags?: boolean;
        tag?: string;
        context?: boolean;
        direction?: number | string;
        moderations?: boolean;
        start_at?: string;
        exif?: boolean;
        colors?: boolean;
        derived_next_cursor?: string;
        faces?: boolean;
        image_metadata?: boolean;
        media_metadata?: boolean;
        pages?: boolean;
        coordinates?: boolean;
        phash?: boolean;
        cinemagraph_analysis?: boolean;
        accessibility_analysis?: boolean;

        [futureKey: string]: any;
    }

    export interface UploadApiOptions {
        access_mode?: AccessMode;
        allowed_formats?: Array<VideoFormat> | Array<ImageFormat>;
        async?: boolean;
        backup?: boolean;
        callback?: string;
        colors?: boolean;
        discard_original_filename?: boolean;
        eager?: TransformationOptions;
        eager_async?: boolean;
        eager_notification_url?: string;
        eval?: string;
        exif?: boolean;
        faces?: boolean;
        filename_override?: string;
        folder?: string;
        format?: VideoFormat | ImageFormat;
        image_metadata?: boolean;
        media_metadata?: boolean;
        invalidate?: boolean;
        moderation?: ModerationKind;
        notification_url?: string;
        overwrite?: boolean;
        phash?: boolean;
        proxy?: string;
        public_id?: string;
        quality_analysis?: boolean;
        resource_type?: "image" | "video" | "raw" | "auto";
        responsive_breakpoints?: Record<any,any>;
        return_delete_token?: boolean
        timestamp?: number;
        transformation?: TransformationOptions;
        type?: DeliveryType;
        unique_filename?: boolean;
        upload_preset?: string;
        use_filename?: boolean;
        chunk_size?: number;
        disable_promises?: boolean;
        oauth_token?: string;
        use_asset_folder_as_public_id_prefix?: boolean;
        from_public_id?: string;
        to_public_id?: string;

        [futureKey: string]: any;
    }

    export interface ProvisioningApiOptions {
        account_id?: string;
        provisioning_api_key?: string;
        provisioning_api_secret?: string;
        agent?: object; //might be Record<any, any>?
        content_type?: string;

        [futureKey: string]: any;
    }

    export interface AuthTokenApiOptions {
        key: string;
        acl: string;
        ip?: string;
        start_time?: number;
        duration?: number;
        expiration?: number;
        url?: string;
    }

    type TransformationOptions =
        string
        | string[]
        | VideoTransformationOptions
        | ImageTransformationOptions
        | Object //might be Record<any, any>
        | Array<ImageTransformationOptions>
        | Array<VideoTransformationOptions>;

    type ImageTransformationAndTagsOptions = ImageTransformationOptions | ImageTagOptions;
    type VideoTransformationAndTagsOptions = VideoTransformationOptions | VideoTagOptions;
    type ImageAndVideoFormatOptions = ImageFormat | VideoFormat;
    type ConfigAndUrlOptions = ConfigOptions | UrlOptions;
    type AdminAndPublishOptions = AdminApiOptions | PublishApiOptions;
    type AdminAndResourceOptions = AdminApiOptions | ResourceApiOptions;
    type AdminAndUpdateApiOptions = AdminApiOptions | UpdateApiOptions;

    /****************************** API *************************************/
    type Status = (string & {}) | "pending" | "approved" | "rejected";
    type StreamingProfiles = (string & {}) | "4k" | "full_hd" | "hd" | "sd" | "full_hd_wifi" | "full_hd_lean" | "hd_lean";
    type ModerationKind = (string & {}) | "manual" | "webpurify" | "aws_rek" | "metascan";
    type AccessMode = (string & {}) | "public" | "authenticated";
    type TargetArchiveFormat = (string & {}) | "zip" | "tgz";

    // err is kept for backwards compatibility, it currently will always be undefined
    type ResponseCallback = (err?: any, callResult?: any) => any;

    export type UploadResponseCallback = (err?: UploadApiErrorResponse, callResult?: UploadApiResponse) => void;

    export interface UploadApiResponse {
        public_id: string;
        version: number;
        signature: string;
        width: number;
        height: number;
        format: string;
        resource_type: "image" | "video" | "raw" | "auto";
        created_at: string;
        tags: Array<string>;
        pages: number;
        bytes: number;
        type: string;
        etag: string;
        placeholder: boolean;
        url: string;
        secure_url: string;
        access_mode: string;
        original_filename: string;
        moderation: Array<string>;
        access_control: Array<string>;
        context: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
        metadata: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
        colors?: [string, number][];

        [futureKey: string]: any;
    }

    export interface UploadApiErrorResponse {
        message: string;
        name: string;
        http_code: number;

        [futureKey: string]: any;
    }

    class UploadStream extends Transform {
    }

    export interface DeleteApiResponse {
        message: string;
        http_code: number;
    }

    export interface MetadataFieldApiOptions {
        external_id?: string;
        type?: string;
        label?: string;
        mandatory?: boolean;
        default_value?: number;
        validation?: object; //there are 4 types, we need to discuss documentation team about it before implementing.
        datasource?: DatasourceEntry;

        [futureKey: string]: any;
    }

    export interface MetadataFieldApiResponse {
        external_id: string;
        type: string;
        label: string;
        mandatory: boolean;
        default_value: number;
        validation: object; //there are 4 types, we need to discuss documentation team about it before implementing.
        datasource: DatasourceEntry;

        [futureKey: string]: any;
    }

    export interface MetadataFieldsApiResponse {
        metadata_fields: MetadataFieldApiResponse[]
    }

    export interface DatasourceChange {
        values: Array<DatasourceEntry>
    }

    export interface ResourceApiResponse {
        resources: [
            {
                public_id: string;
                format: string;
                version: number;
                resource_type: string;
                type: string;
                placeholder: boolean;
                created_at: string;
                bytes: number;
                width: number;
                height: number;
                backup: boolean;
                access_mode: string;
                url: string;
                secure_url: string;
                tags: Array<string>;
                context: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
                next_cursor: string;
                derived_next_cursor: string;
                exif: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
                image_metadata: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
                media_metadata: object;
                faces: number[][];
                quality_analysis: number;
                colors: [string, number][];
                derived: Array<string>;
                moderation: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
                phash: string;
                predominant: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
                coordinates: object; //won't change since it's response, we need to discuss documentation team about it before implementing.
                access_control: Array<string>;
                pages: number;

                [futureKey: string]: any;
            }
        ]
    }

    export interface DatasourceEntry {
        external_id?: string;
        value: string;
    }
