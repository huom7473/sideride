import { Selection } from "../SearchPage"
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';


configure({ adapter: new Adapter() });      // for enzyme methods like mount

const wrapper = mount(<Selection />);
const instance = wrapper.instance();
const fields = ['from', 'to', 'date'];

test('Search page: initialization', () => {
    expect(instance.state.from).toEqual("");
    expect(instance.state.to).toEqual("");
    expect(instance.state.date).toEqual("");
  });



test('Search page: update states (to,from,date) ', () => {
    
    for(var i = 0; i < fields.length; i++){
      const dummy_event = {
        target: { name: fields[i],
        value: 'test-value' 
        }
      };
      instance._handleUpdate(dummy_event);
      if(i === 0){
        expect(instance.state.from).toBe(dummy_event.target.value);
      } else if (i === 1){
        expect(instance.state.to).toBe(dummy_event.target.value);
      } else if (i === 2){
        expect(instance.state.date).toBe(dummy_event.target.value);
      }
    } 

    });

