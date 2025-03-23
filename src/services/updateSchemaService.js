import { supabase } from '../config/supabaseClient';

export const updateJobApplicationsSchema = async () => {
  try {
    console.log("Attempting to update job_applications schema...");
    
    // Add columns to students table
    const { error: studentsError } = await supabase.rpc('execute_sql', {
      sql: `
        ALTER TABLE IF EXISTS students 
        ADD COLUMN IF NOT EXISTS github_url TEXT,
        ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
      `
    });
    
    if (studentsError) {
      console.error("Error updating students table:", studentsError);
      return { success: false, error: studentsError };
    }
    
    // Check if job_applications table exists
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .eq('tablename', 'job_applications');
    
    if (tablesError) {
      console.error("Error checking table existence:", tablesError);
      return { success: false, error: tablesError };
    }
    
    if (!tables || tables.length === 0) {
      // Table doesn't exist, create it
      const { error: createError } = await supabase.rpc('execute_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS job_applications (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            student_id VARCHAR(20) REFERENCES students(student_id),
            company_id UUID REFERENCES companies(id),
            status TEXT DEFAULT 'pending'
          );
        `
      });
      
      if (createError) {
        console.error("Error creating job_applications table:", createError);
        return { success: false, error: createError };
      }
    }
    
    // Add columns if they don't exist
    const { error: alterError } = await supabase.rpc('execute_sql', {
      sql: `
        ALTER TABLE IF EXISTS job_applications 
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
        ADD COLUMN IF NOT EXISTS applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        ADD COLUMN IF NOT EXISTS notes TEXT;
      `
    });
    
    if (alterError) {
      console.error("Error adding columns to job_applications:", alterError);
      return { success: false, error: alterError };
    }
    
    // Create trigger for updated_at
    const { error: triggerError } = await supabase.rpc('execute_sql', {
      sql: `
        DROP TRIGGER IF EXISTS applications_handle_updated_at ON job_applications;
        
        CREATE OR REPLACE FUNCTION handle_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = TIMEZONE('utc'::text, NOW());
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER applications_handle_updated_at
            BEFORE UPDATE ON job_applications
            FOR EACH ROW
            EXECUTE FUNCTION handle_updated_at();
      `
    });
    
    if (triggerError) {
      console.error("Error creating trigger on job_applications:", triggerError);
      return { success: false, error: triggerError };
    }
    
    console.log("Successfully updated job_applications schema");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating schema:", error);
    return { success: false, error };
  }
};

export const updateJobPostingsSchema = async () => {
  try {
    console.log("Attempting to update job_postings schema...");
    
    // Create the job_postings table if it doesn't exist
    const { error: createError } = await supabase
      .from('job_postings')
      .insert([]) // This will create the table if it doesn't exist
      .select();

    if (createError && createError.code === '42P01') { // Table doesn't exist
      const { error: createTableError } = await supabase.rpc('create_job_postings_table', {
        sql: `
          CREATE TABLE IF NOT EXISTS job_postings (
            id SERIAL PRIMARY KEY,
            company_id UUID REFERENCES companies(id),
            company_name TEXT NOT NULL,
            job_description TEXT,
            job_requirements TEXT,
            location TEXT,
            salary_range TEXT,
            posting_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
          );
        `
      });

      if (createTableError) {
        console.error("Error creating job_postings table:", createTableError);
        return { success: false, error: createTableError };
      }
    }

    console.log("Successfully updated job_postings schema");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating job_postings schema:", error);
    return { success: false, error };
  }
};


