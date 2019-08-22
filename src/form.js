
const Schema =require("async-validator").default;
require("jquery/jquery");
const inputTypeWhiteList=['text','color','date','datetime-local','email','hidden','month','number','password','range','tel','time','url','week','search'];
class Form {
    constructor(el,config={
        rules:{},
        onSubmit:()=>{},
        onChange:(values,item)=>{},
        errorRender:null,

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
    // 检查一个值
    validateOne(){

    }

    // 对于输入事件的处理
    bindChangeEvents(){

    }
    /**
     * 当检查到错误时，会修改inputwrapper的style或class或添加一些元素，
     * 需要在验证通过时将这些异常恢复原状，即下一次onChange通过
     * 同理
     * 当onChange时，对应的异常触发，在下次校验通过时也需要恢复原状
     * 1.变化之前记住当前树
     * 2.校验通过后将树恢复原状，并保证value是最新的
     * @param {*} inputItem
     * @param {*} error
     */
    errorRender(inputItem,error){

        $(inputItem).css({'border':'1px solid #f00'})
    }
    errorRenderCancel(inputItem){

    }
}

module.exports=Form;
