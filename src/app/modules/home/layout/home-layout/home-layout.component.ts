import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/ui/navbar/navbar.component';
import { HeroSectionComponent } from "../../components/hero-section/hero-section.component";

@Component({
  selector: 'app-home-layout',
  imports: [NavbarComponent, HeroSectionComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.css'
})
export class HomeLayoutComponent {

}
