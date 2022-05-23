import _ from 'lodash';

String.prototype.trimChars = function (c) {
    var re = new RegExp("^[" + c + "]+|[" + c + "]+$", "g");
    return this.replace(re,"");
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

class Actions{
	constructor(props) {

	}
   sleep=(ms)=>{
      return new Promise(resolve => setTimeout(resolve, ms));
   }

	uuidv4=()=>{
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=>{
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    
    getObject=(_obj, path, defaultValue=undefined)=>{
            var obj=_.clone(_obj, true)
            if (!path || !obj) return defaultValue
            path = path.split('.');
            var current = obj;
            while(path.length) {
                if(typeof current !== 'object' || typeof path!== 'object') return defaultValue;
                if(!path||!current) return current
                current = current[path.shift()];
            }
            return current 
        }

     replaceVariablesFromString=(text, dic)=>{
      text=_.clone(text, true);
      if(!text) return text
      let variables=`${text}`.match(/[^{\}]+(?=})/g); //get the variable name from a regex
      if (Array.isArray(variables)){ //start replacing here. A list is returned
        variables.map((variable)=>{
            let variable_value=this.getObject(dic, variable); //value can be null
            text=text.replaceAll(`{${variable}}`, variable_value)
        })
        text=text.replaceAll("{", "");
        text=text.replaceAll("}", "");
        return text
      }else{
        return text
      } 
    }


}

export default new Actions()