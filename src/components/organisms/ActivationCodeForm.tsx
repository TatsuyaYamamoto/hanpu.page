import * as React from "react";
import Input from "@material-ui/core/Input";

class ActivationCodeForm extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Input
          defaultValue={""}
          onChange={this.onChange}
          inputProps={{
            "aria-label": "Description"
          }}
        />
      </React.Fragment>
    );
  }

  private onChange = () => {};
}

export default ActivationCodeForm;
