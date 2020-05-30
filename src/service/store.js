import Vuex from 'vuex';
import Vue from 'vue';
import {httpGet} from './httprequest';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        members: []
    },
    getters : {
        MEMBERS: (state) => {
            return state.members;        
        }
    },
    mutations: {
        SET_MEMBERS: (state, members) => {
            state.members = members;
        },
        ADD_MEMBER: (state, newMember) => {
            state.members.push(newMember);
        },
        DELETE_MEMBER: (state, memberId) => {
            var indexToDelete = -1;
            for(var index = 0; index < state.members.length; index++){
                if(state.members[index].userId == memberId){
                    indexToDelete = index;
                    break;
                }   
            }
            state.members.splice(indexToDelete,1);
        }
    },
    actions : {
        GET_MEMBERS : (context,channel) => {
            httpGet('/members',{channel : channel}).then((data)=>{
                context.commit('SET_MEMBERS',data);
            })
        }
    }  
  });

  export default store;