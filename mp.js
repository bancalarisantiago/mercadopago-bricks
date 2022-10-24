
const mp = new MercadoPago('TEST-246e7b18-7353-4de7-b81a-d37a68af980e');

const bricksBuilder = mp.bricks();


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const price = urlParams.get('price')




const renderCardPaymentBrick = async (bricksBuilder) => {
  console.log("Price", price)
const settings = {
  initialization: {
    amount: price ?? 100, // monto a ser pago
  },
  callbacks: {
    onReady: () => {
      // callback llamado cuando Brick esté listo
    },
    onSubmit: (cardFormData) => {
      // callback llamado cuando el usuario haga clic en el botón enviar los datos
        //console.log("card form", cardFormData)
      // ejemplo de envío de los datos recolectados por el Brick a su servidor
      return new Promise((resolve, reject) => {
          const capturePayment = {...cardFormData, capture : false}

          fetch("http://10.0.2.2:3001/api/v1/mercadopago", { 

    
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  
              },
              body: JSON.stringify(capturePayment),
              

          })
          .then((response) => {
              // recibir el resultado del pago
              console.log("RESPONJSE", response)
              resolve();
          })
          .catch((error) => {
              // tratar respuesta de error al intentar crear el pago
              console.log(error)
              reject();
          })
        });
    },
    onError: (error) => { 
      // callback llamado para todos los casos de error de Brick
      console.log(error)
    },
  },
};
const cardPaymentBrickController = await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', settings);
};
renderCardPaymentBrick(bricksBuilder);





const renderPaymentBrick = async (bricksBuilder) => {
  const settings = {
    initialization: {
      amount: 100, // monto a ser pago
    },
    customization: {
      paymentMethods: {
        creditCard: 'all',
        debitCard: 'all',
      },
    },
    callbacks: {
      onReady: () => {
        // callback llamado cuando Brick esté listo
      },
      onSubmit: ({ selectedPaymentMethod, formData }) => {
        // callback llamado cuando el usuario haz clic en el botón enviar los datos
          return new Promise((resolve, reject) => {
            fetch("http://localhost:3001/api/v1/travel/process_payment", {

              method: "POST",
              headers: {
                "Content-Type": "application/json",
                
              },
              body: JSON.stringify(formData)
            })
              .then((response) => {
                // recibir el resultado del pago
                resolve();
              })
              .catch((error) => {
                // tratar respuesta de error al intentar crear el pago
                reject();
              })
          });
      },
      onError: (error) => {
        // callback llamado para todos los casos de error de Brick
      },
    },
  };
  window.paymentBrickController = await bricksBuilder.create(
    'payment',
    'paymentBrick_container',
    settings
  );
 };
 renderPaymentBrick(bricksBuilder);
