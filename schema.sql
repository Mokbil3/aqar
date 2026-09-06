-- ============================================================
-- AQAR PLATFORM DATABASE SCHEMA
-- Version: 1.0
-- MySQL 8+
-- ============================================================

DROP DATABASE IF EXISTS aqar;

CREATE DATABASE aqar
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE aqar;

-- ============================================================
-- COUNTRIES
-- ============================================================

CREATE TABLE countries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,

    iso_code CHAR(2) NOT NULL UNIQUE,

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- STATES / GOVERNORATES
-- ============================================================

CREATE TABLE states (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    country_id BIGINT NOT NULL,

    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_states_country
        FOREIGN KEY (country_id)
        REFERENCES countries(id)
        ON DELETE CASCADE
);

-- ============================================================
-- CITIES
-- ============================================================

CREATE TABLE cities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    state_id BIGINT NOT NULL,

    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_cities_state
        FOREIGN KEY(state_id)
        REFERENCES states(id)
        ON DELETE CASCADE
);

-- ============================================================
-- DISTRICTS
-- ============================================================

CREATE TABLE districts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    city_id BIGINT NOT NULL,

    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_district_city
        FOREIGN KEY(city_id)
        REFERENCES cities(id)
        ON DELETE CASCADE
);

-- ============================================================
-- NEIGHBORHOODS
-- ============================================================

CREATE TABLE neighborhoods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    district_id BIGINT NOT NULL,

    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_neighborhood_district
        FOREIGN KEY(district_id)
        REFERENCES districts(id)
        ON DELETE CASCADE
);

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    first_name VARCHAR(100),
    last_name VARCHAR(100),

    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    country_code VARCHAR(10),
    phone VARCHAR(50),

    avatar VARCHAR(255),

    role ENUM(
        'admin',
        'agency',
        'agent',
        'owner',
        'customer'
    ) DEFAULT 'customer',

    email_verified BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,

    last_login DATETIME NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- AGENCIES
-- ============================================================

CREATE TABLE agencies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    owner_user_id BIGINT NOT NULL,

    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,

    logo VARCHAR(255),

    email VARCHAR(255),
    phone VARCHAR(50),

    website VARCHAR(255),

    address TEXT,

    license_number VARCHAR(100),

    description_en TEXT,
    description_ar TEXT,

    is_verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_agency_owner
        FOREIGN KEY(owner_user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================
-- AGENTS
-- ============================================================

CREATE TABLE agents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,
    agency_id BIGINT NULL,

    title_en VARCHAR(255),
    title_ar VARCHAR(255),

    biography_en TEXT,
    biography_ar TEXT,

    experience_years INT DEFAULT 0,

    whatsapp VARCHAR(50),

    is_verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_agent_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_agent_agency
        FOREIGN KEY(agency_id)
        REFERENCES agencies(id)
        ON DELETE SET NULL
);

-- ============================================================
-- PROPERTY TYPES
-- ============================================================

CREATE TABLE property_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    name_en VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100) NOT NULL
);

-- ============================================================
-- PROPERTIES
-- ============================================================

CREATE TABLE properties (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT,
    agency_id BIGINT,
    agent_id BIGINT,

    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,

    slug_en VARCHAR(255) UNIQUE,
    slug_ar VARCHAR(255) UNIQUE,

    description_en LONGTEXT,
    description_ar LONGTEXT,

    country_id BIGINT NOT NULL,
    state_id BIGINT NOT NULL,
    city_id BIGINT NOT NULL,
    district_id BIGINT NOT NULL,
    neighborhood_id BIGINT NOT NULL,

    property_type_id BIGINT NOT NULL,

    purpose ENUM(
        'sale',
        'rent'
    ) NOT NULL,

    price DECIMAL(18,2) NOT NULL,

    currency VARCHAR(10) DEFAULT 'AED',

    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,

    parking_spaces INT DEFAULT 0,

    area DECIMAL(12,2),

    plot_area DECIMAL(12,2),

    year_built YEAR NULL,

    furnished BOOLEAN DEFAULT FALSE,

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),

    address TEXT,

    video_url TEXT,

    virtual_tour_url TEXT,

    featured BOOLEAN DEFAULT FALSE,

    views_count BIGINT DEFAULT 0,

    status ENUM(
        'available',
        'reserved',
        'sold',
        'rented',
        'draft'
    ) DEFAULT 'available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_property_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_property_agency
        FOREIGN KEY(agency_id)
        REFERENCES agencies(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_property_agent
        FOREIGN KEY(agent_id)
        REFERENCES agents(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_property_country
        FOREIGN KEY(country_id)
        REFERENCES countries(id),

    CONSTRAINT fk_property_state
        FOREIGN KEY(state_id)
        REFERENCES states(id),

    CONSTRAINT fk_property_city
        FOREIGN KEY(city_id)
        REFERENCES cities(id),

    CONSTRAINT fk_property_district
        FOREIGN KEY(district_id)
        REFERENCES districts(id),

    CONSTRAINT fk_property_neighborhood
        FOREIGN KEY(neighborhood_id)
        REFERENCES neighborhoods(id),

    CONSTRAINT fk_property_type
        FOREIGN KEY(property_type_id)
        REFERENCES property_types(id),

    INDEX idx_properties_purpose (purpose),
    INDEX idx_properties_status (status),
    INDEX idx_properties_city (city_id),
    INDEX idx_properties_price (price)
);

-- ============================================================
-- PROPERTY IMAGES
-- One property can have many photos; is_primary marks the hero image.
-- ============================================================

CREATE TABLE property_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    property_id BIGINT NOT NULL,

    image_url VARCHAR(500) NOT NULL,
    alt_text_en VARCHAR(255),
    alt_text_ar VARCHAR(255),

    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_image_property
        FOREIGN KEY(property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE,

    INDEX idx_images_property (property_id)
);

-- ============================================================
-- FEATURES (master list of amenities, e.g. "Private pool")
-- ============================================================

CREATE TABLE features (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,

    icon_class VARCHAR(100)
    -- e.g. "fa-solid fa-person-swimming", matches Font Awesome classes
    -- already loaded on property.html
);

-- ============================================================
-- PROPERTY FEATURES (junction table: which features apply to which property)
-- ============================================================

CREATE TABLE property_features (
    property_id BIGINT NOT NULL,
    feature_id BIGINT NOT NULL,

    PRIMARY KEY (property_id, feature_id),

    CONSTRAINT fk_pf_property
        FOREIGN KEY(property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pf_feature
        FOREIGN KEY(feature_id)
        REFERENCES features(id)
        ON DELETE CASCADE
);

-- ============================================================
-- INQUIRIES (contact-agent / request-a-viewing form submissions)
-- ============================================================

CREATE TABLE inquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    property_id BIGINT NOT NULL,
    user_id BIGINT NULL,

    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),

    message TEXT,

    status ENUM(
        'new',
        'contacted',
        'closed'
    ) DEFAULT 'new',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inquiry_property
        FOREIGN KEY(property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_inquiry_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    INDEX idx_inquiries_property (property_id)
);
