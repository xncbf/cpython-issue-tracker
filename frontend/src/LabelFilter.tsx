import { TextField, Chip, Autocomplete } from '@mui/material';
import { Label } from './types';

type LabelFilterProps = {
  labels: Label[];
  value: string[];
  onChange: any;
};

function LabelFilter({ labels, value, onChange }: LabelFilterProps) {
  return (
    <Autocomplete
      multiple
      id="labels-autocomplete"
      options={labels}
      getOptionLabel={(option) => option.name}
      value={labels.filter((label) => value.includes(label.id.toString()))}
      onChange={(e, v) => onChange('labels', v)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Search labels..."
          name="labels"
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={option.name}
            {...getTagProps({ index })}
          />
        ))
      }
    />
  );
}

export default LabelFilter;
