import Vuex from 'vuex';
import Vue from 'vue';
import {httpGet} from './httprequest';
Vue.use(Vuex);

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getNickName(name) {
    var curState = window.talkify.store.getters.NICK_NAMES;
    var names = name.split(" ");
    var nickName = "";
    for(var index = 0; index <  names.length; index++){
        nickName = nickName + names[index][0];
        if(curState.indexOf(nickName) != -1){
            continue;
        }else{
            break;
        }
    }
    return nickName;
}
function assignMemberColorAndNick(member){
    member["color"] = getRandomColor();
    var nickName = getNickName(member["userName"]);
    window.talkify.store.commit('ADD_NICK_NAME',nickName);
    member["nickName"] = nickName;
    return member;
}
function assignMembersColorsAndNick(members) {
    for(var index = 0; index < members.length; index++){
        members[index] = assignMemberColorAndNick(members[index]);
    }
    return members;
}
const store = new Vuex.Store({
    state: {
        members: [],
        nickNames: []
    },
    getters : {
        MEMBERS: (state) => {
            return state.members;        
        },
        memberById: (state) => (id) => {
            return state.members.find(member => member.userId == id);
        },
        NICK_NAMES: (state) => {
            return state.nickNames;
        }
    },
    mutations: {
        SET_MEMBERS: (state, members) => {
            state.members = assignMembersColorsAndNick(members);
        },
        ADD_MEMBER: (state, newMember) => {
            state.members.push(assignMemberColorAndNick(newMember));
        },
        DELETE_MEMBER: (state, memberId) => {
            var indexToDelete = -1;
            for(var index = 0; index < state.members.length; index++){
                if(state.members[index].userId == memberId){
                    indexToDelete = index;
                    break;
                }   
            }
            window.talkify.store.commit('REMOVE_NICK_NAME',state.members[indexToDelete]["nickName"]);
            state.members.splice(indexToDelete,1);
        },
        ADD_NICK_NAME: (state, nickName) => {
            state.nickNames.push(nickName);
        },
        REMOVE_NICK_NAME: (state, nickName) => {
            state.nickNames.splice(state.nickNames.indexOf(nickName),1);
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