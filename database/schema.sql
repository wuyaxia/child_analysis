-- 儿童成长中心应用 PostgreSQL 数据库 Schema
-- 创建时间: 2026-05-19

BEGIN;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  family_id INTEGER,
  current_member_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP DEFAULT NOW()
);

-- 家庭表
CREATE TABLE IF NOT EXISTS families (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  invite_code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 家庭成员表
CREATE TABLE IF NOT EXISTS family_members (
  id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  username VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('father', 'mother', 'grandpa', 'grandma', 'other')),
  nickname VARCHAR(255),
  avatar TEXT,
  joined_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 儿童表
CREATE TABLE IF NOT EXISTS children (
  id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('boy', 'girl')),
  avatar TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 成长记录表
CREATE TABLE IF NOT EXISTS growth_records (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL,
  date DATE NOT NULL,
  record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('daily', 'milestone', 'emotion', 'skill')),
  content TEXT NOT NULL,
  photos TEXT[],
  tags TEXT[],
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 任务表（区分预置和自定义）
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  child_id INTEGER,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('routine', 'exercise', 'cognitive', 'social', 'selfcare', 'artistic', 'safety')),
  difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  age_min INTEGER NOT NULL,
  age_max INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  knowledge_ids INTEGER[],
  frequency VARCHAR(50) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'once')),
  completed_dates DATE[],
  is_custom BOOLEAN DEFAULT FALSE,
  source_preset_id VARCHAR(255),
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 知识库文章表
CREATE TABLE IF NOT EXISTS knowledge_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  age_group VARCHAR(10) NOT NULL CHECK (age_group IN ('3', '4', '5', '6')),
  categories TEXT[],
  tags TEXT[],
  source VARCHAR(50) CHECK (source IN ('中国卫健委', '美国儿科学会', '通用')),
  is_favorite BOOLEAN DEFAULT FALSE,
  read_progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 情绪记录表
CREATE TABLE IF NOT EXISTS emotion_records (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL,
  date DATE NOT NULL,
  emotion VARCHAR(50) NOT NULL CHECK (emotion IN ('happy', 'calm', 'excited', 'frustrated', 'sad', 'angry')),
  trigger TEXT,
  response TEXT,
  notes TEXT,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 里程碑表
CREATE TABLE IF NOT EXISTS milestones (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('language', 'motor', 'social', 'cognitive')),
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 回顾表
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  age VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  problems TEXT[],
  improvements TEXT[],
  notes TEXT,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 成长测量表
CREATE TABLE IF NOT EXISTS growth_measurements (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL,
  date DATE NOT NULL,
  age_months INTEGER NOT NULL,
  height NUMERIC NOT NULL,
  weight NUMERIC NOT NULL,
  head_circumference NUMERIC,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 分析报告表
CREATE TABLE IF NOT EXISTS analysis_reports (
  id SERIAL PRIMARY KEY,
  child_id INTEGER NOT NULL,
  age VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  sections JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_family_id ON users(family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_family_id ON family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_children_family_id ON children(family_id);
CREATE INDEX IF NOT EXISTS idx_growth_records_child_id ON growth_records(child_id);
CREATE INDEX IF NOT EXISTS idx_growth_records_date ON growth_records(date);
CREATE INDEX IF NOT EXISTS idx_tasks_child_id ON tasks(child_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_emotion_records_child_id ON emotion_records(child_id);
CREATE INDEX IF NOT EXISTS idx_emotion_records_date ON emotion_records(date);
CREATE INDEX IF NOT EXISTS idx_milestones_child_id ON milestones(child_id);
CREATE INDEX IF NOT EXISTS idx_milestones_date ON milestones(date);
CREATE INDEX IF NOT EXISTS idx_reviews_child_id ON reviews(child_id);
CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(date);
CREATE INDEX IF NOT EXISTS idx_growth_measurements_child_id ON growth_measurements(child_id);
CREATE INDEX IF NOT EXISTS idx_growth_measurements_date ON growth_measurements(date);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_child_id ON analysis_reports(child_id);

COMMIT;
