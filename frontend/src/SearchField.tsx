import { TextField } from '@mui/material';

type SearchFilterProps = {
    value: string;
    onChange: any;
  };

function SearchField({ value, onChange }: SearchFilterProps) {
  return (
    <TextField
      name="search"
      label="Search by title and body"
      variant="outlined"
      value={value}
      onChange={onChange}
      sx={{ flex: 1 }}
    />
  );
}

export default SearchField;
