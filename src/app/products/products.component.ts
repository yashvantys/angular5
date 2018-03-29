import { Component, OnInit } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { CommonModule } from '@angular/common';
import 'rxjs/add/operator/map';
import { DataTablesModule } from 'angular-datatables';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';


class ProductsData {
  product_id: number;
  product_name: string;
  details: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public data: Object;
  dtOptions: DataTables.Settings = {};
  product: ProductsData[]; 
  closeResult: string;
  private myGroup: FormGroup;
  product_id: FormControl;
  product_name: FormControl;
  details: FormControl;
  productId: number;
  productName:string;
  productDetails:string;
  urlLink:string;
  public error:boolean=false;
  public productPostData = {
    'product_id':'',
    'product_name': '',
    'details':''
  };  
  constructor(private http: HttpClient) { }
 
  ngOnInit():void {
    this.fetchProducts();
    this.createFormControls();
    this.createForm();      
  }

  fetchProducts(): void {
        this.dtOptions = {
        pageLength: 10,
        lengthChange:false,    
        "language": {
          "emptyTable": "No data available in Products"
        },
        order : [[1, 'asc']],
        ajax: 'http://local.lumenapi.com/products/index',
              columns: [
                {
                  title: 'ID',
                  data: 'product_id',
                  "orderable": false
                },
                {
                  title: 'Product name',
                  data: 'product_name'
                },
                {
                  title: 'Details',
                  data: 'details'
                },
                {
                  data: null, render: function (data, type, row) {
                      return `<button type="button" class="btn btn-primary editbutton"  products-id="${data.product_id}" products-name="${data.product_name}" products-details="${data.details}">Edit</button>
                              <button type="button" class="btn btn-danger deletebutton" products-id="${data.product_id}">Delete</button>`;
                  },
                  "orderable": false
              }
            
            ]
          };
          document.querySelector('body').addEventListener('click', (event)=> {
            let target = <Element>event.target; // Cast EventTarget into an Element
            if (target.tagName.toLowerCase() == 'button' && $(target).hasClass('editbutton')) {
                let productId = target.getAttribute('products-id');
                let productName = target.getAttribute('products-name');
                let productDetails = target.getAttribute('products-details');
                this.editProduct(productId,productName,productDetails);
            }
            if (target.tagName.toLowerCase() == 'button' && $(target).hasClass('deletebutton')) {
                  let productId = target.getAttribute('products-id');
                  this.deleteProduct(productId);
            }
            if (target.tagName.toLowerCase() == 'button' && $(target).hasClass('addbutton')) {
                let productId = target.getAttribute('products-id');
                let productName = target.getAttribute('products-name');
                let productDetails = target.getAttribute('products-details');
                this.addProduct();
            }             
        });
      }

    public deleteProduct(productId) {
       let request = confirm("Are you sure want to delete?");  
       if (request) {
            this.http.post('http://local.lumenapi.com/products/delete', JSON.stringify({"product_id":productId,"api_token":localStorage.getItem('api_token')}),{headers:new HttpHeaders})
                 .subscribe(res => {
                  if(res['statusCode'] == 200) {
                    $('#ajaxResults').addClass('alert alert-success').html('Product deleted successfully') ;
								      setTimeout(function() {
						       			  $('#ajaxResults').removeClass('alert alert-success').html('');
						       			}, 2000);
                    var table = $('#products').DataTable();
				            table.ajax.reload(null, false);
                  }
              }, err => {
                console.log("error:" +err);

              });
       }
    }   
   
    public editProduct(productId,productName,productDetails) {
      this.productId = productId;
      this.productName = productName;
      this.productDetails = productDetails;
      (<any>$('#editModal')).modal('show');
      
    }


    createFormControls() {
      this.product_id = new FormControl('');
      this.product_name = new FormControl('', [
        Validators.required        
      ]);
      this.details = new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]);
      
    }
  
    createForm() {
      this.myGroup = new FormGroup({
        product_id: this.product_id,
        product_name: this.product_name,
        details: this.details      
      });
    }

    onSubmit(){
      if (this.myGroup.valid) {       
        this.productPostData.product_name = this.myGroup.value.product_name;
        this.productPostData.details = this.myGroup.value.details;
        let productdata = "product_name=" + this.productPostData.product_name + "&details=" + this.productPostData.details;
        if(this.productId){
          this.urlLink = "http://local.lumenapi.com/products/update";
        }else{
          this.urlLink = "http://local.lumenapi.com/products/create";
        }  
      
        this.http.post(this.urlLink, JSON.stringify({"product_id":this.productId,"product_name":this.productPostData.product_name,"details":this.productPostData.details,"api_token":localStorage.getItem('api_token')}),{headers:new HttpHeaders})
        .subscribe((response) => {
          if(response['statusCode'] == 200) {
            this.myGroup.reset();
            (<any>$('#editModal')).modal('hide');
            $('#ajaxResults').addClass('alert alert-success').html('Product added/updated successfully') ;
              setTimeout(function() {
                   $('#ajaxResults').removeClass('alert alert-success').html('');
                 }, 2000);
            var table = $('#products').DataTable();
            table.ajax.reload(null, false);
          }
        });
               
      }
  }

  public addProduct(){
    this.productId = null;
    this.productName = null;
    this.productDetails = null;
    (<any>$('#editModal')).modal('show');
  }

  resetProductForm(){
    this.myGroup.reset();
   }

}
