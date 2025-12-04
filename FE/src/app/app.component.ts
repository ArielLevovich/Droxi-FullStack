import { Component } from '@angular/core';
import { InboxComponent } from './components/inbox/inbox.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InboxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Smart Inbox';
}
