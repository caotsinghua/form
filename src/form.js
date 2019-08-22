
const Schema =require("async-validator").default;
require("jquery/jquery");
const inputTypeWhiteList=['text','color','date','datetime-local','email','hidden','month','number','password','range','tel','time','url','week','search'];
class Form {
    constructor(el,config={
        rules:{},
        onSubmit:()=>{},
        onChange:(values,item)=>{},
        errorRender:null
    }){
        const {rules,onSubmit,onChange,errorRender}=config;
        this.rules=rules;
        this.onSubmit=onSubmit;
        this.onChange=onChange;
        this.el=$(el);
        this.validator=new Schema(rules);
        this.data={};// 表单数据
        if(errorRender){
            this.errorRender=errorRender;
        }

    }

    getFormFields(){
        const formItems=this.el.find('.form-item');
        const _this=this;
        formItems.each(function(idx){
            // 每一个formItem里只能有一个name属性的tag
            const inputItems=$(this).find("[name]");
            if(inputItems.length===1){
                // 只有白名单的值赋值
                if(inputTypeWhiteList.includes(inputItems.attr('type'))){
                    const name=inputItems.attr('name');
                    const value=inputItems.val();
                    _this.data[name]=value;
                }
            }else{
                const firstInputItem=inputItems[0];
                const name=firstInputItem.name;
                if(firstInputItem.nodeName.toLowerCase()==='input'){
                    switch(firstInputItem.type){
                        case 'radio':{
                            _this.getRadioValue(name);
                            break;
                        }
                        case 'checkbox':{
                            _this.getCheckboxValue(name)
                        }
                        default:break;
                    }
                }

            }
        })
        return this.data;
    }

    getRadioValue(name){
        // 根据name获取radio集合的值
        this.data[name]=$(`input[name=${name}]:checked`).val();
    }

    getCheckboxValue(name){
        // 获取checkbox的值=>Array<>
        const values=[];
        $(`input[name=${name}]:checked`).each(function(){
            values.push($(this).val());
        })
        this.data[name]=values;
    }

    validate(callback){
        this.getFormFields();
        this.validator.validate(this.data,(errors,fields)=>{
            if(errors){
                errors.forEach(error=>{
                    const {field:name,message}=error;
                    const formInputWrapper=$(`.form-item:has([name=${name}])  .form-input-wrapper`)[0];
                    this.errorRender(formInputWrapper,error);
                })
            }
            callback(errors,fields);
        })
    }

    errorRender(inputItem,error){

        $(inputItem).css({'border':'1px solid #f00'})
    }
}

module.exports=Form;
