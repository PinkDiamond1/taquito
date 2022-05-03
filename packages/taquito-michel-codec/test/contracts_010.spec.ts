import  * as fs from 'fs';
import path from 'path';
import { inspect } from 'util';
import { Contract, ContractOptions } from '../src/michelson-contract';
import { Protocol } from '../src/michelson-types';
import { MichelsonError } from '../src/utils';

const contracts: {
  [group: string]: string[];
} = {
  mini_scenarios: [
    'xcat.tz',
    'vote_for_delegate.tz',
    'parameterized_multisig.tz',
    'ticket_wallet_fungible.tz',
    'hardlimit.tz',
    'execution_order_appender.tz',
    'authentication.tz',
    'groth16.tz',
    'lockup.tz',
    'self_address_receiver.tz',
    'self_address_sender.tz',
    'replay.tz',
    'create_contract.tz',
    'reveal_signed_preimage.tz',
    'xcat_dapp.tz',
    'default_account.tz',
    'multiple_en2.tz',
    'legacy_multisig.tz',
    'weather_insurance.tz',
    'big_map_entrypoints.tz',
    'tzip4_view.tz',
    'big_map_write.tz',
    'execution_order_storer.tz',
    'big_map_store.tz',
    'multiple_entrypoints_counter.tz',
    'big_map_magic.tz',
    'ticket_builder_non_fungible.tz',
    'execution_order_caller.tz',
    'lqt_fa12.mligo.tz',
    'fa12_reference.tz',
    'ticket_wallet_non_fungible.tz',
    'create_contract_simple.tz',
    'generic_multisig.tz',
    'big_map_read.tz',
    'ticket_builder_fungible.tz',
  ],
  ill_typed: [
    'ticket_apply.tz',
    'never_literal.tz',
    'multiple_code_field.tz',
    'unpair_field_annotation_mismatch.tz',
    'set_update_non_comparable.tz',
    'pack_operation.tz',
    'failwith_big_map.tz',
    'stack_bottom_ungetable.tz',
    'stack_bottom_undipable.tz',
    'stack_bottom_undup2able.tz',
    'multiple_storage_field.tz',
    'stack_bottom_unfailwithable.tz',
    'stack_bottom_undug2able.tz',
    'missing_only_storage_field.tz',
    'uncomb0.tz',
    'contract_annotation_default.tz',
    'multiple_storage_and_code_fields.tz',
    'uncomb1.tz',
    'invalid_self_entrypoint.tz',
    // "badly_indented.tz",
    'chain_id_arity.tz',
    'stack_bottom_undropable.tz',
    'ticket_in_ticket.tz',
    'stack_bottom_unrightable.tz',
    'stack_bottom_unleftable.tz',
    'stack_bottom_undigable.tz',
    'stack_bottom_undugable.tz',
    'sapling_build_empty_state_with_int_parameter.tz',
    'comb1.tz',
    'missing_only_parameter_field.tz',
    'big_dip.tz',
    'comb0.tz',
    'stack_bottom_unpopable.tz',
    'missing_only_code_field.tz',
    'big_map_arity.tz',
    'push_big_map_with_id_without_parens.tz',
    'stack_bottom_undip2able.tz',
    'big_drop.tz',
    'pack_big_map.tz',
    'missing_parameter_and_storage_fields.tz',
    'dup0.tz',
    'unpack_sapling_state.tz',
    'stack_bottom_undig2able.tz',
    'push_big_map_with_id_with_parens.tz',
    'ticket_dup.tz',
    'ticket_unpack.tz',
    'stack_bottom_unpopable_in_lambda.tz',
    'stack_bottom_unpairable.tz',
    'multiple_parameter_field.tz',
    'pack_sapling_state.tz',
    'sapling_push_sapling_state.tz',
  ],
  macros: [
    'assert_neq.tz',
    'assert_cmpge.tz',
    'compare.tz',
    'take_my_money.tz',
    'assert_ge.tz',
    'guestbook.tz',
    'carn_and_cdrn.tz',
    'map_caddaadr.tz',
    'big_map_get_add.tz',
    'assert_lt.tz',
    'assert_cmplt.tz',
    'pair_macro.tz',
    'macro_annotations.tz',
    'fail.tz',
    'min.tz',
    'assert_gt.tz',
    'assert_cmpeq.tz',
    'unpair_macro.tz',
    'set_caddaadr.tz',
    'assert.tz',
    'max_in_list.tz',
    'compare_bytes.tz',
    'assert_cmpneq.tz',
    'assert_cmpgt.tz',
    'assert_eq.tz',
    'assert_cmple.tz',
    'build_list.tz',
    'big_map_mem.tz',
    'assert_le.tz',
  ],
  entrypoints: [
    'no_default_target.tz',
    'no_entrypoint_target.tz',
    'manager.tz',
    'big_map_entrypoints.tz',
    'rooted_target.tz',
    'delegatable_target.tz',
    'simple_entrypoints.tz',
  ],
  opcodes: [
    'ticket_join.tz',
    'diff_timestamps.tz',
    'if.tz',
    'and.tz',
    'loop_left.tz',
    'transfer_amount.tz',
    'concat_hello.tz',
    'dip.tz',
    'self_with_default_entrypoint.tz',
    'create_contract_rootname_alt.tz',
    'ticketer-2.tz',
    'check_signature.tz',
    'comb-set.tz',
    'set_car.tz',
    'pexec_2.tz',
    'neg_bls12_381_g1.tz',
    'cons.tz',
    'int.tz',
    'compare.tz',
    'map_id.tz',
    'contains_all.tz',
    'source.tz',
    'map_iter.tz',
    'dropn.tz',
    'uncomb.tz',
    'self_with_entrypoint.tz',
    'mul_overflow.tz',
    'create_contract_rootname.tz',
    'balance.tz',
    'reverse_loop.tz',
    'contract.tz',
    'sapling_empty_state.tz',
    'mutez_to_bls12_381_fr.tz',
    'tez_add_sub.tz',
    'ticket_bad.tz',
    'slices.tz',
    'bytes.tz',
    'set_iter.tz',
    'list_map_block.tz',
    'bls12_381_fr_z_int.tz',
    'originate_big_map.tz',
    'list_size.tz',
    'ticket_store-2.tz',
    'set_id.tz',
    'merge_comparable_pairs.tz',
    'list_concat_bytes.tz',
    'mul_bls12_381_g2.tz',
    'ediv_mutez.tz',
    'get_and_update_map.tz',
    'compare_big_type.tz',
    'map_mem_string.tz',
    'comb-get.tz',
    'set_cdr.tz',
    'concat_hello_bytes.tz',
    'get_and_update_big_map.tz',
    'ediv.tz',
    'set_size.tz',
    'list_iter.tz',
    'bls12_381_z_fr_nat.tz',
    'cdr.tz',
    'list_id.tz',
    'xor.tz',
    'comb-set-2.tz',
    'bls12_381_fr_to_int.tz',
    'compare_big_type2.tz',
    'noop.tz',
    'bls12_381_fr_push_nat.tz',
    'transfer_tokens.tz',
    'mul_bls12_381_fr.tz',
    'or_binary.tz',
    'munch.tz',
    'self_address.tz',
    'big_map_mem_string.tz',
    'hash_string.tz',
    'level.tz',
    'if_some.tz',
    'first.tz',
    'packunpack.tz',
    'dugn.tz',
    'store_bls12_381_g1.tz',
    'and_logical_1.tz',
    'map_size.tz',
    'subset.tz',
    'not_binary.tz',
    'add_bls12_381_g1.tz',
    'ticket_split.tz',
    'ret_int.tz',
    'slice_bytes.tz',
    'chain_id_store.tz',
    'add_delta_timestamp.tz',
    'add_timestamp_delta.tz',
    'list_concat.tz',
    'voting_power.tz',
    'not.tz',
    'mul.tz',
    'sha3.tz',
    'car.tz',
    'create_contract.tz',
    'and_binary.tz',
    'self.tz',
    'get_big_map_value.tz',
    'ticket_read.tz',
    'neg_bls12_381_fr.tz',
    'big_map_mem_nat.tz',
    'exec_concat.tz',
    'pexec.tz',
    'store_bls12_381_g2.tz',
    'add_bls12_381_g2.tz',
    'map_mem_nat.tz',
    'map_car.tz',
    'abs.tz',
    'packunpack_rev_cty.tz',
    'big_map_to_self.tz',
    'store_input.tz',
    'map_map.tz',
    'packunpack_rev.tz',
    'chain_id.tz',
    'utxo_read.tz',
    'unpair.tz',
    'concat_list.tz',
    'or.tz',
    'comb.tz',
    'split_bytes.tz',
    'empty_map.tz',
    'ticket_big_store.tz',
    'proxy.tz',
    'map_map_sideeffect.tz',
    'split_string.tz',
    'bls12_381_fr_to_mutez.tz',
    'reverse.tz',
    'bls12_381_fr_z_nat.tz',
    'set_member.tz',
    'ticketer.tz',
    'shifts.tz',
    'bls12_381_z_fr_int.tz',
    'slice.tz',
    'comb-literals.tz',
    'bls12_381_fr_push_bytes_not_padded.tz',
    'comparisons.tz',
    'utxor.tz',
    'add.tz',
    'sub_timestamp_delta.tz',
    'mul_bls12_381_g1.tz',
    'dign.tz',
    'store_now.tz',
    'dipn.tz',
    'neg.tz',
    'dig_eq.tz',
    'pairing_check.tz',
    'set_delegate.tz',
    'store_bls12_381_fr.tz',
    'none.tz',
    'add_bls12_381_fr.tz',
    'get_map_value.tz',
    'hash_consistency_checker.tz',
    'left_right.tz',
    'keccak.tz',
    'str_id.tz',
    'neg_bls12_381_g2.tz',
    'sender.tz',
    'address.tz',
    'update_big_map.tz',
    'ticket_store.tz',
    'dup-n.tz',
    'pair_id.tz',
    'list_id_map.tz',
    'hash_key.tz',
  ],
  lib_protocol: [
    'sapling_contract_drop.tz',
    'sapling_contract_state_as_arg.tz',
    'sapling_contract.tz',
    'sapling_use_existing_state.tz',
    'temp_big_maps.tz',
    'sapling_contract_send.tz',
    'sapling_contract_double.tz',
  ],
};

describe('PtGRANAD', () => {
  for (const [group, list] of Object.entries(contracts)) {
    describe(group, () => {
      for (const contract of list) {
        it(contract, () => {
          const options: ContractOptions = {
            protocol: Protocol.PtGRANAD,
          };

          const filename = path.resolve(__dirname, 'contracts_010', group, contract);
          const src = fs.readFileSync(filename).toString();
          if (group === 'ill_typed') {
            expect(() => Contract.parse(src, options)).toThrow();
            return;
          }

          try {
            Contract.parse(src, options);
          } catch (err) {
            if (err instanceof MichelsonError) {
              console.log(inspect(err, false, null));
            }
            throw err;
          }
        });
      }
    });
  }
});
