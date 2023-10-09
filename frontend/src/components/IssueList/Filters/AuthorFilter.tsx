import { TextField, Autocomplete } from '@mui/material';
import { User } from '../../../types';

type AuthorFilterProps = {
  authors: User[];
  value: string; // value는 선택된 저자의 id를 나타냅니다.
  onChange: (field: string, value: string) => void;
};

function AuthorFilter({ authors, value, onChange }: AuthorFilterProps) {
  return (
    <Autocomplete
      id="authors-autocomplete"
      options={authors}
      getOptionLabel={(option) => option.login}
      value={authors?.find((author) => author.id.toString() === value)}
      onChange={(e, v) => onChange('author', v ? v.id.toString() : '')}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Search author..."
          name="author"
        />
      )}
    />
  );
}

export default AuthorFilter;
