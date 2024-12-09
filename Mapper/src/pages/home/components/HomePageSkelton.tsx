import { Box, Skeleton } from "@mui/material";
export const HomePageSkelton = () => (
<Box>
  <Box
    sx={{
      display: "flex",
      alignContent: "center",
      justifyContent: "space-between",
      padding: 2,
    }}
  >
    <Skeleton variant="rectangular" width={"40%"} height={40} />
    <Skeleton variant="rectangular" width={"40%"} height={40} />
    <Skeleton variant="rectangular" width={"10%"} height={40} />
  </Box>
  <Skeleton animation="wave" />
  <Skeleton animation="wave" />
  <Skeleton animation="wave" />
  <Skeleton variant="rectangular" width={"100%"} height={200} />
</Box>
)
