import { TextField, Autocomplete } from '@mui/material';
import { User } from '../../../types';
import { fetchUsers } from '../../../api';

type AuthorFilterProps = {
  authors: User[];
  value: string; // value는 선택된 저자의 id를 나타냅니다.
  setAuthors: (authors: User[]) => void;
  onChange: (field: string, value: string) => void;
};

function AuthorFilter({
  authors,
  value,
  setAuthors,
  onChange,
}: AuthorFilterProps) {
  return (
    <Autocomplete
      id="authors-autocomplete"
      options={authors}
      getOptionLabel={(option) => option.login}
      value={authors.find((author) => author.id.toString() === value)}
      onChange={(e, v) => onChange('author', v ? v.id.toString() : '')}
      onInputChange={async (event, newInputValue) => {
        const users = await fetchUsers(newInputValue);
        setAuthors(users.items); // 서버에서 받아온 유저 목록으로 options 업데이트
      }}
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
