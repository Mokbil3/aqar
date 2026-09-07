USE aqar;

-- ============================================================
-- LOCATIONS
-- ============================================================

INSERT INTO countries (id, name_en, name_ar, iso_code, latitude, longitude) VALUES
(1, 'United Arab Emirates', 'الإمارات العربية المتحدة', 'AE', 23.4241, 53.8478);

INSERT INTO states (id, country_id, name_en, name_ar, latitude, longitude) VALUES
(1, 1, 'Dubai', 'دبي', 25.2048, 55.2708),
(2, 1, 'Ajman', 'عجمان', 25.4052, 55.5136);

INSERT INTO cities (id, state_id, name_en, name_ar, latitude, longitude) VALUES
(1, 1, 'Dubai', 'دبي', 25.2048, 55.2708),
(2, 2, 'Ajman', 'عجمان', 25.4052, 55.5136);

INSERT INTO districts (id, city_id, name_en, name_ar, latitude, longitude) VALUES
(1, 1, 'Palm Jumeirah', 'نخلة جميرا', 25.1124, 55.1390),
(2, 1, 'Dubai Marina', 'مرسى دبي', 25.0805, 55.1403),
(3, 2, 'Al Rashidiya', 'الراشدية', 25.4111, 55.4551);

INSERT INTO neighborhoods (id, district_id, name_en, name_ar, latitude, longitude) VALUES
(1, 1, 'Frond M', 'الجريد إم', 25.1124, 55.1390),
(2, 2, 'Marina Promenade', 'ممشى المرسى', 25.0805, 55.1403),
(3, 3, 'Al Rashidiya 1', 'الراشدية 1', 25.4111, 55.4551);

-- ============================================================
-- PROPERTY TYPES
-- ============================================================

INSERT INTO property_types (id, name_en, name_ar) VALUES
(1, 'Villa', 'فيلا'),
(2, 'Apartment', 'شقة'),
(3, 'Townhouse', 'تاون هاوس');

-- ============================================================
-- USERS / AGENCY / AGENT
-- ============================================================

INSERT INTO users (id, first_name, last_name, email, password_hash, phone, avatar, role, email_verified) VALUES
(1, 'Sara', 'Al Mansoori', 'sara@aqar.ae', '$2b$10$replaceThisWithARealBcryptHashLater', '+971412345678', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80', 'agent', TRUE);

INSERT INTO agencies (id, owner_user_id, name_en, name_ar, email, phone, is_verified) VALUES
(1, 1, 'Aqar Realty', 'عقار العقارية', 'contact@aqar.ae', '+97141234567', TRUE);

INSERT INTO agents (id, user_id, agency_id, title_en, title_ar, experience_years, whatsapp, is_verified) VALUES
(1, 1, 1, 'Senior Listing Agent', 'وكيل عقاري أول', 8, '+971501234567', TRUE);

-- ============================================================
-- FEATURES
-- ============================================================

INSERT INTO features (id, name_en, name_ar, icon_class) VALUES
(1, 'Private pool', 'مسبح خاص', 'fa-solid fa-person-swimming'),
(2, 'Beach access', 'إطلالة على الشاطئ', 'fa-solid fa-umbrella-beach'),
(3, 'Covered parking', 'موقف سيارات مغطى', 'fa-solid fa-car'),
(4, 'Staff annex', 'ملحق للخدم', 'fa-solid fa-house-user'),
(5, 'Gated security', 'أمن على مدار الساعة', 'fa-solid fa-shield-halved'),
(6, 'Fitted kitchen', 'مطبخ مجهز', 'fa-solid fa-kitchen-set'),
(7, 'Home gym', 'صالة رياضية', 'fa-solid fa-dumbbell'),
(8, 'Central A/C', 'تكييف مركزي', 'fa-solid fa-snowflake'),
(9, 'Balcony', 'شرفة', 'fa-solid fa-building'),
(10, 'Sea view', 'إطلالة على البحر', 'fa-solid fa-water');

-- ============================================================
-- PROPERTIES
-- ============================================================

INSERT INTO properties (
    id, user_id, agency_id, agent_id,
    title_en, title_ar, slug_en, slug_ar,
    description_en, description_ar,
    country_id, state_id, city_id, district_id, neighborhood_id,
    property_type_id, purpose, price, currency,
    bedrooms, bathrooms, parking_spaces, area, plot_area, year_built, furnished,
    latitude, longitude, address, featured, status
) VALUES
(1, 1, 1, 1,
 'Frond M Signature Villa', 'فيلا الجريد إم المميزة',
 'frond-m-signature-villa', 'فيلا-الجريد-إم-المميزة',
 'Set on a signature frond of Palm Jumeirah, this fully upgraded villa pairs a private beach with unobstructed views across the Arabian Gulf. The layout opens onto a landscaped garden and infinity pool, with a separate staff annex and a four-car covered driveway.',
 'تقع هذه الفيلا المطورة بالكامل على أحد الجريد المميزة في نخلة جميرا، وتجمع بين شاطئ خاص وإطلالات مفتوحة على الخليج العربي.',
 1, 1, 1, 1, 1,
 1, 'sale', 2500000.00, 'AED',
 5, 6, 4, 8200.00, 10500.00, 2019, TRUE,
 25.1124, 55.1390, 'Frond M, Palm Jumeirah, Dubai', TRUE, 'available'),

(2, 1, 1, 1,
 'Marina Promenade 2BR', 'شقة غرفتين ممشى المرسى',
 'marina-promenade-2br', 'شقة-غرفتين-ممشى-المرسى',
 'A bright two-bedroom apartment on Dubai Marina''s Promenade, with floor-to-ceiling windows facing the water and full access to the building''s gym and pool deck.',
 'شقة مضيئة من غرفتين على ممشى مرسى دبي، بنوافذ ممتدة من الأرض إلى السقف تطل على الماء.',
 1, 1, 1, 2, 2,
 2, 'rent', 145000.00, 'AED',
 2, 2, 1, 1250.00, NULL, 2015, FALSE,
 25.0805, 55.1403, 'Marina Promenade, Dubai Marina, Dubai', TRUE, 'available'),

(3, 1, 1, 1,
 'Al Rashidiya Family Townhouse', 'تاون هاوس عائلي الراشدية',
 'al-rashidiya-family-townhouse', 'تاون-هاوس-عائلي-الراشدية',
 'A quiet, family-friendly townhouse in Al Rashidiya with a private garden, close to schools and the Ajman corniche.',
 'تاون هاوس هادئ ومناسب للعائلات في الراشدية، مع حديقة خاصة وقرب من المدارس وكورنيش عجمان.',
 1, 2, 2, 3, 3,
 3, 'sale', 890000.00, 'AED',
 3, 3, 2, 2100.00, 2600.00, 2012, FALSE,
 25.4111, 55.4551, 'Al Rashidiya 1, Ajman', FALSE, 'available');

-- ============================================================
-- PROPERTY IMAGES
-- ============================================================

INSERT INTO property_images (property_id, image_url, alt_text_en, is_primary, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80', 'Villa exterior with private pool', TRUE, 0),
(1, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80', 'Villa living room', FALSE, 1),
(1, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80', 'Villa bedroom', FALSE, 2),

(2, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80', 'Apartment living room with marina view', TRUE, 0),
(2, 'https://images.unsplash.com/photo-1560184611-ff3e53f00e8f?w=1600&q=80', 'Apartment kitchen', FALSE, 1),

(3, 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600&q=80', 'Townhouse exterior', TRUE, 0),
(3, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80', 'Townhouse living room', FALSE, 1);

-- ============================================================
-- PROPERTY FEATURES
-- ============================================================

INSERT INTO property_features (property_id, feature_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
(2, 5), (2, 6), (2, 8), (2, 9), (2, 10),
(3, 3), (3, 5), (3, 6), (3, 8);
