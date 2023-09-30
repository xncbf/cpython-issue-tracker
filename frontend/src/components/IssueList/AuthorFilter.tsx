import { TextField, Chip, Autocomplete } from '@mui/material';
import { User } from '../../types';

type AuthorFilterProps = {
  authors: User[];
  value: string[];
  onChange: any;
};

function AuthorFilter({ authors, value, onChange }: AuthorFilterProps) {
  return (
    <Autocomplete
      multiple
      id="authors-autocomplete"
      options={authors}
      getOptionLabel={(option) => option.login}
      value={authors.filter((author) => value.includes(author.id.toString()))}
      onChange={(e, v) => onChange('authors', v)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Search authors..."
          name="authors"
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={option.login}
            {...getTagProps({ index })}
          />
        ))
      }
    />
  );
}

export default AuthorFilter;
