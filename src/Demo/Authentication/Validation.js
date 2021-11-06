import React from 'react';
import * as zxcvbn from 'zxcvbn';

export function required(value) {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };
  
  export function minMaxLength(text, minLength, maxLength) {
      let result = !text || text.length < minLength;
      if(maxLength)
          result = result || text.length < minLength;
      return result;
  }
   
  export function validEmail(text) {
      const regex = RegExp(
          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        );
       
      return !regex.test(text);
  }
  
  
   export function passwordStrength(text) {
      let result = zxcvbn(text);
      return result.score < 3;
  }



  