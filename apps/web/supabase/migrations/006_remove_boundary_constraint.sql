-- Remove Indiranagar boundary constraint to allow places from all of Bangalore
-- The map will still focus on Indiranagar initially but show all places when zoomed out

-- Drop the check constraint
ALTER TABLE places DROP CONSTRAINT IF EXISTS check_indiranagar_boundaries;

-- Add a comment explaining the change
COMMENT ON TABLE places IS 'Stores all places visited by Amit across Bangalore, not limited to Indiranagar. Map focuses on Indiranagar by default but shows all places when zoomed out.';