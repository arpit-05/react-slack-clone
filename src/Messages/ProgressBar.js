import React from 'react';
import {Progress} from 'semantic-ui-react'
const ProgressBar=({ uploadState,percentUploaded})=>(
//you can also use uploadState==='uploading' , it will onl show the Progress Bar only when uploading and disapper after it.

 uploadState && (
    <Progress className='progress__bar'
              percent={percentUploaded}
              progress
              indicating
              size='medium'
              inverted />
 )
)
export default ProgressBar