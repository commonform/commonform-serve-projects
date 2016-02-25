/* Copyright 2016 Kyle E. Mitchell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var concat = require('concat-stream')
var http = require('http')
var series = require('async-series')
var server = require('./server')
var tape = require('tape')

tape('GET /publishers/$publisher/projects/$project/editions', function(test) {
  test.plan(3)
  var form = 'a'.repeat(64)
  server(function(port, done) {
    series(
      [ function put1e(done) {
          http.request(
            { auth: ( 'ana:ana\'s password' ),
              method: 'POST',
              port: port,
              path: '/publishers/ana/projects/nda/editions/1e' },
            function(response) {
              test.equal(response.statusCode, 201, 'POST 201')
              done() })
            .end(JSON.stringify({ form: form })) },
        function put1e1u(done) {
          http.request(
            { auth: ( 'ana:ana\'s password' ),
              method: 'POST',
              port: port,
              path: '/publishers/ana/projects/nda/editions/1e1u' },
            function(response) {
              test.equal(response.statusCode, 201, 'POST 201')
              done() })
            .end(JSON.stringify({ form: form })) },
        function getEditions(done) {
          http.request(
            { method: 'GET',
              port: port,
              path: '/publishers/ana/projects/nda/editions' },
            function(response) {
              response.pipe(concat(function(buffer) {
                var responseBody = JSON.parse(buffer)
                test.deepEqual(
                  responseBody, [ '1e', '1e1u' ],
                  'GET editions JSON')
                done() })) })
            .end() } ],
      function finish() {
        done()
        test.end() }) }) })
