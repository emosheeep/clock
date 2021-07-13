import '@vant/touch-emulator';
import {
  Form,
  Field,
  Dialog,
  NavBar,
  Loading,
  Tag,
  CellGroup,
  Cell,
  Area,
  Popup,
  Radio,
  RadioGroup,
  Button,
  Switch,
  Sticky,
  Swipe,
  SwipeItem,
} from 'vant';

const components = [
  Form,
  Field,
  Dialog,
  NavBar,
  Loading,
  Tag,
  CellGroup,
  Cell,
  Area,
  Popup,
  Radio,
  RadioGroup,
  Button,
  Switch,
  Sticky,
  Swipe,
  SwipeItem,
];

export default function(app) {
  components.forEach(c => app.use(c));
}
