//
//  ViewController.swift
//  ButtonExample
//
//  Created by ews on 6/5/16.
//  Copyright © 2016 ews, llc. All rights reserved.
//

import UIKit
import Accounts
import Social
import SwifteriOS
import SafariServices

class ViewController: UIViewController {

    //swifter
    var tweets : [JSONValue] = []

    // CTRL + Click the button on the view controller, drag over. view storyboard and this file
    // in columns.
    
    // Button outlet
    @IBOutlet weak var btnButton: UIButton!
    
    // ctrl + drag button to create new outlet
    @IBOutlet weak var btnButton2: UIButton!
    
    @IBAction func buttonClicked(sender: UIButton) {
        // print to the debug console when the button was clicked
        NSLog("The button has been clicked");
       
        //swifter
        let url = NSURL(string: "swifter://success")!
        let swifter = Swifter(consumerKey: "0MvGLBs6Ndd2ox8nhAAWvNnA8", consumerSecret: "Qe1xcH14q0oXQwCYokx7PbLTVKpXAaRO4n1Zq3OKREILoEp92y")

        
        func alertWithTitle(title: String, message: String) {
            let alert = UIAlertController(title: title, message: message, preferredStyle: UIAlertControllerStyle.Alert)
            alert.addAction(UIAlertAction(title: "OK", style: .Default, handler: nil))
            self.presentViewController(alert, animated: true, completion: nil)
        }
        let failureHandler: ((NSError) -> Void) = { error in
            alertWithTitle("Error", message: error.localizedDescription)
        }
        
        func TwitterLoginSuccess() {
            NSLog("Twitter login success");
            /* GET TWEETS
            swifter.getStatusesHomeTimelineWithCount(20, success: { statuses in
                // Successfully fetched timeline, so lets create and push the table view
                print(statuses?.description)
                //let tCount = statuses?.count
                //print(tCount)
                }, failure: failureHandler)
            */
            
            /* GET FRIENDS
            swifter.getFriendsIDsWithScreenName("votoapp", cursor: nil, stringifyIDs: true, count: nil, success: { (ids, previousCursor, nextCursor) -> Void in
                print(ids)
                }, failure: failureHandler)
            
            */
            
            swifter.getAccountVerifyCredentials(false, skipStatus: false, success: { (myInfo) -> Void in
                
                //Dictionary<String, JSONValue>? myinfo
                print(myInfo)
                 //   print(myInfo?.count)
                
                
                
            }, failure: failureHandler)

        }
      
        
        swifter.authorizeWithCallbackURL(url, presentFromViewController: self, success: { _ in
            TwitterLoginSuccess()
            }, failure: failureHandler)
      

        
        // end swifter

        
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

