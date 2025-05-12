-- Create exam_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS exam_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study_group_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS study_group_members (
  group_id UUID NOT NULL,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- Insert sample exam categories
INSERT INTO exam_categories (id, name, description)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '10th Grade', 'Study group for 10th grade students preparing for board exams'),
  ('22222222-2222-2222-2222-222222222222', '12th Grade', 'Study group for 12th grade students preparing for board exams'),
  ('33333333-3333-3333-3333-333333333333', 'IIT JEE', 'Preparation group for IIT JEE aspirants'),
  ('44444444-4444-4444-4444-444444444444', 'UPSC', 'Civil services examination preparation group'),
  ('55555555-5555-5555-5555-555555555555', 'GATE', 'Graduate Aptitude Test in Engineering preparation'),
  ('66666666-6666-6666-6666-666666666666', 'Foreign Universities', 'Study group for students preparing for international university admissions')
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for these tables
alter publication supabase_realtime add table exam_categories;
alter publication supabase_realtime add table study_group_members;