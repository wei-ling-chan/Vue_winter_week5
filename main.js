const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'wlc606';
const productModal = {  
  props:['id','addToCart','openModal'],
  
  data(){
    return{
      tempProduct:{},
      modal:{},
      qty:1,    
      text:1234,        
    };
  },  
  template:'#userProductModal',
  watch:{ //當id變動時，取得遠端資料
    id(){
      console.log('productModal',this.id);
      if(this.id){
        axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
        .then(res=>{        
        this.tempProduct = res.data.product;
        console.log(res.data.product);
        console.log(this.tempProduct);
        // console.log('單一產品',this.tempProduct);
        this.modal.show();                    
      })
      }
      
    }
  },  
  methods:{
    hide(){
      this.modal.hide();      
    },
  },
  mounted(){         
    console.log(this.$refs.modal);         
    this.modal = new bootstrap.Modal(this.$refs.modal); 
    console.log(this.modal);   
    console.log(this.openModal); 
    this.openModal.productId = '';
    console.log(this.openModal); 
    // console.log(this.$refs.modal);    
    //監聽:當 modal關閉時，會做一些事    
    this.$refs.modal.addEventListener('hidden.bs.modal', (event) => {      
      this.openModal('');          
    });
  },
};
const test = {
  data(){
    return{
      text:'000',          
    };
  },
  template:'#testTemplate',    
};
//表單驗證
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email,min,max,integer} = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;
//使用規則 必填、email、超過8碼
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
defineRule('integer', integer);
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json'); //加入多國語系

configure({ // 用來做一些設定
  generateMessage: localize('zh_TW'), //啟用 locale 
  VeeValidateNoInput:true, //輸入字元立即驗證
});

/**************************/
const app = Vue.createApp({  
  data() {
    return {
      text: 'hello',
      products:[],
      productId:'',     
      cart:{},
      lodingItem:'',
      lodingItema:'',
      isLoading: false,
      tempProduct:{},   
      data:{
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: "",
      },
                   
    };
  },  
  components:{
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods:{
    //loading
    doAjax() {
      this.isLoading = true;
      // simulate AJAX
      setTimeout(() => {
          this.isLoading = false
      }, 1000)
    },    
    //取得產品
    getProducts(){
      axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
        .then(res=>{        
        this.products = res.data.products;        
      })
      .catch((err)=>{
          alert(err.response.data.message);
        });
    },    
    openModal(id,tempProduct){      
      this.productId = id;
      tempProduct;
      console.log('外層帶入的id',id);          
    }, 
    //加入購物車
    addToCart(product_id,qty=1){
      this.lodingItem = product_id;
      const data = {        
          product_id,
          qty,
      };
      axios.post(`${apiUrl}/v2/api/${apiPath}/cart`,{ data })
        .then(res=>{                        
          this.$refs.productModal.hide();  
          alert('加入購物車成功!');
          this.getCart();
          this.lodingItem ='';                 
        })
        .catch((err)=>{
          alert(err.response.data.message);
        });      
    },
    //取得購物車
    getCart(){
      axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
      .then(res=>{              
        this.cart = res.data.data;    
        console.log(this.cart);                                       
      })
      .catch((err)=>{
          alert(err.response.data.message);
        });       
    },
    //更新購物車
    updateCart(item){ //購物車id 產品id
      this.lodingItem = item.id;
      const data={
        product_id: item.product.id,
        qty: item.qty,
      }
      console.log(data);
      axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`,{ data })
        .then(res=>{    
           alert('更新成功');        
          this.getCart();
          this.lodingItem ='';                 
        })
        .catch((err)=>{
          alert(err.response.data.message);
        });     
    },
    //刪除單一品項購物車
    deleteCartItem(item){    
      this.lodingItem = item.id;  
      axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`)
      .then(res=>{           
        alert('刪除成功');  
        this.lodingItem = '';   
        this.getCart();
                                      
      })
      .catch((err)=>{
          alert(err.data.message);
          this.lodingItem = '';
      });     
      
    },
    //刪除全部品項購物車
    deleteCartAll(){       
      this.lodingItem = '123';   
      axios.delete(`${apiUrl}/v2/api/${apiPath}/carts`)        
      .then(res=>{
        console.log(res.data); 
        alert('刪除成功'); 
        this.lodingItem = '';        
        this.getCart();                                      
      })
      .catch((err)=>{
          alert(err.data.message);     
          this.lodingItem = '';     
        });    
        
    },
    //結帳
    order(){ 
      console.log(this.data);
      const orderData = {
        data:this.data,
      };     
      
      axios.post(`${apiUrl}/v2/api/${apiPath}/order`,orderData)
      .then(res=>{
        console.log(res.data);   
        this.$refs.form.resetForm();                                      
      })
      .catch((err)=>{
          alert(err.response.data.message);
        });
      this.cart = '';
      this.$refs.form.resetForm();
    },
    //reset表單
    resetForm(){
      console.log(this.$refs.form);
      this.$refs.form.resetForm();
    },
  },
  mounted(){
    this.doAjax();
    this.getProducts();  
    this.getCart();                     
  }
})
app.component('product-modal',productModal);
app.component("loading", VueLoading.Component);
app.mount('#app');

