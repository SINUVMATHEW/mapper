import SignInCard from "./SignInCard";
import Content from "./Content";
import { Box } from "@mui/material";
// import AppTheme from './theme/AppTheme';
// import ColorModeSelect from './theme/ColorModeSelect';

export default function SignInSide() {
  return (
    <Box sx={{display:"flex",flexDirection:"row",justifyContent:"space-around",backgroundColor:"#141118" ,borderRadius:2}}>

      <Content />
      <SignInCard />
    </Box>
  );
}
