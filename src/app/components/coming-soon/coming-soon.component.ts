import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="coming-soon-container">
      <div class="coming-soon-card">
        <div class="icon">🚧</div>
        <h2>Coming Soon</h2>
        <p>This feature is under development and will be available in the next update.</p>
        <div class="features">
          <h3>Planned Features:</h3>
          <ul>
            <li>Advanced management capabilities</li>
            <li>Data import/export</li>
            <li>Reporting and analytics</li>
            <li>Multi-user access control</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .coming-soon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 2rem;
    }

    .coming-soon-card {
      background: white;
      border-radius: 12px;
      padding: 3rem;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 100%;
    }

    .icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 2rem;
    }

    p {
      color: #7f8c8d;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .features {
      text-align: left;
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
    }

    .features h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }

    .features ul {
      list-style: none;
      padding: 0;
    }

    .features li {
      padding: 0.5rem 0;
      color: #555;
      position: relative;
      padding-left: 1.5rem;
    }

    .features li:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #27ae60;
      font-weight: bold;
    }

    @media (max-width: 768px) {
      .coming-soon-card {
        padding: 2rem 1rem;
      }
      
      .icon {
        font-size: 3rem;
      }
      
      h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ComingSoonComponent {}