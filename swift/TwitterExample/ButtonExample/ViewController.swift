//
//  ViewController.swift
//  ButtonExample
//
//  Created by ews on 6/5/16.
//  Copyright © 2016 ews, llc. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    
    // CTRL + Click the button on the view controller, drag over. view storyboard and this file 
    // in columns.
    
    // Button outlet
    @IBOutlet weak var btnButton: UIButton!
    
    // ctrl + drag button to create new outlet
    @IBOutlet weak var btnButton2: UIButton!
    
    @IBAction func buttonClicked(sender: UIButton) {
        // print to the debug console when the button was clicked
        NSLog("The button has been clicked");
        
    }
    
    
    @IBAction func Button2Clicked(sender: UIButton) {
        // print to the debug console when the button2 was clicked
        NSLog("The button2 has been clicked");
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

