import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const GreenRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

export default function RadioButtons(props) {
  const [selectedValue, setSelectedValue] = React.useState('0');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
      props.parent.setState({property : selectedValue});
  },[props.parent, selectedValue])

  return (
    <div>
        <FormControlLabel
            value="start"
            control={
                <Radio
                    checked={selectedValue === '0'}
                    onChange={handleChange}
                    value="0"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'A' }}
                />
            }
            label="法人"
            labelPlacement="start"
        />
        <FormControlLabel
            value="start"
            control={
                <GreenRadio
                    checked={selectedValue === '1'}
                    onChange={handleChange}
                    value="1"
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'B' }}
                />
            }
            label="個人"
            labelPlacement="start"
        />
    </div>
  );
}
