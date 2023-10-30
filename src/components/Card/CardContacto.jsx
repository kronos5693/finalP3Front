import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

function BioCard() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box>
        <Card
          sx={{
            width: 320,
            maxWidth: '100%',
            boxShadow: '4', // Ajusta la intensidad de la sombra (puedes usar valores del 1 al 24)
            marginTop: '-60px', // Ajusta el margen superior (tres veces más arriba)
          }}
        >
          <CardContent
            sx={{
              alignItems: 'center',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 4, // Ajusta el espacio vertical (valor reducido)
            }}
          >
            <Avatar
              src="https://lh3.googleusercontent.com/pw/ADCreHfCOqkk_cLzUiOMdpsJ4omrisHePThvESViX3jVntZ5omsuL88KH3s6aC7mbh8MISs5mmgRSdkocURl7eVHfgx_cYFsQV2hUMkhOMcutq1nb88NgV9eELkyBWDctIFGWXD_nHtAs3g6w6J46g4Vnlw2df9t_ZClv8fvYv05F392W-Ozds5Qc4bkWjXpJtGkdgY5l2yFlsPBrKMdMw6l8wPrll0GqAKXjFNpOQpDwGbmkStSo7ovVgdo568nLbeMRQbjgvJKi9UCHuyMkc9ddfaW77Hj9ddtFvlPxfqda6RqYwwIGWGYitsgbQ9mJUpLUeyXsrDjgTS-IzEv4JU1VZsg3DCPChML1tn41i2DoYhpdI49Z7Jv_yGr8ySWT2CqqfRiPyOV0-6yKNaZ3gpkPmGXm39K60jzcz4llpXgfawNql13Rp31QeNaonNGE8ov_laIpj2g0nzA4HcHHzXPkL8-2p7_BInIgYxX2zcKa_k8pTfhpHxftpNT4Y1iuVbRVXvCHCVvV4WRBtN7OFPwqyUjpWxR9nWggg4EcQcm2mX9oaTnNdwVR59Y2IE7pDLXwgv8F3wD_Oh_s7LAPS68DclblYT2RsNEjVqpwkoKjpQhqPiCtHlPKXtZi-MBFGe3Dcz4Ec-csV4h-RGyVM4CvEZ89JglTfxbE0m3eO-1MpbvRCKebE4UKJzpyR0fybsqjZ_babvZckRGjUQoLjvhUbtnlKU9b9cFP3zvTyo9IWt1dggAv74425k8_4GSCFfuQuYwq1kLdg2QPrVT8ZL5pDtk9LZEsdStPNXYC2ZVz3HyQ019YVr9dAnIGWwpDnOaLif9L0jtrM9Oax2l1gXTBR2n_Y58lUCwxqCWXKnhsGdWZpVL2Xx1R72U5dhPE2y8KGpOLwrhGc6eGfMdWyCEvPt6HQJ1eRAeCSr2xGVLXyFZndpVzuziw_RZ1W4PWzbu4Gm3KQ2oNCBlYpvHsONdiqVYRnIWcVwwYn_5ZYXXbe--myPXVP5y9zl1rMn01gaY9RQkCXHuPkmQJUOcpZdFax8_0HTT8WU7xs7QQznNGqaXYX1EygOqc-_3747MCK_WkQsukKLHE_ElxwYzXqrDNbFaEd7xX2eiwIta-D73gptwu3-CQg=w939-h939-s-no-gm?authuser=0"
              sx={{
                width: 150,
                height: 150,
              }}
            />
            <Typography
              variant="h6" // Ajusta el tamaño del texto
            >
              Werner Alejandro Krull
            </Typography>
            <Typography level="body-sm" sx={{ maxWidth: '24ch' }}>
              Proyecto Final para la materia de Programación 3
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default BioCard;
